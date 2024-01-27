import {useState} from 'react';
import clsx from 'clsx';

const api_key = "5299cb48eefffcd273820af88db4ffcb"
let audioContext;

const textToSpeech = async (inputText, voiceId) => {
    let options = {
        method: 'POST',
        headers: {
            'xi-api-key': api_key,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: `{"text": "${inputText}"}`
    };

    return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, options)
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .catch(err => console.error(err));
}

const scriptToAudio = async (jsonScript) => {
    let json = JSON.parse(jsonScript)
    json.dialogue.forEach(async (element, index) => {
        let speech = element.speech
//        element.audio = textToSpeech(speech, element.voiceId)
        element.audio = await Promise.resolve("https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-0.mp3")
    });
    return json
}

function DevScreen() {

    const [dialogList, setDialogueList] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [background, setBackground] = useState(null);
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);

    const parseScript = async () => {
        let input = test_json //TODO: Get from other screens
        let result = await scriptToAudio(input)
        setBackground(result.background)
        let response = await Promise.all(result.dialogue.map(async (element) => {
            let newAudio = await element.audio
            element.audio = newAudio
            return element
        }));
        console.log(response)
        setDialogueList(response)
        extractCharacters(response)

        audioPlay(response, 0)
    }

    const extractCharacters = (dialog) => {
        dialog.forEach((entry) => {
            if(entry.name != "Narrator" && !characters.includes(entry.name)) {
                characters.push(entry)
            }
        })
    }

    const audioPlay = (dialogue, index) => {
        let currentEntry = dialogue[index]
        if(currentEntry) {
            setCurrentItem(currentEntry)

            let audio = new Audio(currentEntry.audio)
            audio.addEventListener("ended", (event) => {
                console.log(`END ${index}`);
                setTimeout(() => {
                    audioPlay(dialogue, index + 1)
                }, 660)
            })
            audio.play();
        } else {
            setFinished(true)
        }
    };

    function start() {
        setStarted(true)
        audioContext = new AudioContext()
        parseScript()
    }

    function next() {
        //TODO: Move to voting screen
    }

    return (
        <section>
            { !finished ? <button onClick={start}>Start</button>:  <p></p> }

            { started && !currentItem ? <p>LOADING</p> :  <p></p> }

            { currentItem ?
            <div class="image-container">
                <img src={background} width="800"/>
                <div id="char1" class={clsx("character", currentItem.name != characters[0].name && !finished && 'inactive-character')} />
                <div id="char2" class={clsx("character", currentItem.name != characters[1].name && !finished && 'inactive-character')} />
                <div id="char3" class={clsx("character", currentItem.name != characters[2].name && !finished && 'inactive-character')} />
            </div> : <p></p>
            }

            { currentItem && !finished ?
           <div>
                <p>{currentItem.name}</p>
                <p>{currentItem.speech}</p>
            </div>: <p></p>
            }

            { finished ? <div>
                <button onClick={next}>Next</button>
                </div> :  <p></p>
            }

        </section>
        );
}

export default DevScreen;

const test_json = `{
    "title": "Titanic Troubles",
    "background": "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlJTIwc2hvcCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
    "dialogue": [
    {
        "name": "Narrator",
        "voiceId": "cKx1nyNQBkX7cXitLRzo",
        "speech": "Passengers are dancing and socializing. Suddenly, ROLAND, a grizzled old southern American man wearing suspenders, spots STEVE, a geeky accountant, adjusting his glasses and furiously scribbling numbers on paper. LARRY, a smooth-talking ladies man, approaches the duo."
    },
    {
        "name": "Roland",
        "voiceId": "mIbUdNBiJryF43xFXqOl",
        "personality": "Old southern American man, Loves trucks",
        "speech": "Well, if it ain't my ol' pals Steve and Larry! What's got y'all away from your usual shenanigans?"
    },
    {
        "name": "Steve",
        "voiceId": "D9Thk1W7FRMgiOhy3zVI",
        "speech": "Numbers"
    },
    {
        "name": "Norma",
        "voiceId": "xNGR0IG7oSi0Xxc2I7DV",
        "speech": "Oh my!"
    }
]
}`