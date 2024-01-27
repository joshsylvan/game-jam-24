import {useState} from 'react';

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
        element.audio = textToSpeech(speech, element.voiceId)
//        element.audio = await Promise.resolve("https://file-examples.com/storage/fed61549c865b2b5c9768b5/2017/11/file_example_MP3_700KB.mp3")
    });
    return json
}

const audioPlay = (dialogue, index) => {
    let currentEntry = dialogue[index]
    if(currentEntry) {
        let audio = new Audio(currentEntry.audio)
        audio.addEventListener("ended", (event) => {
            console.log(`END ${index}`);
            setTimeout(() => {
                audioPlay(dialogue, index + 1)
            }, 750)
        })
        audio.play();
    }
};

function DevScreen() {

    const [dialogList, setDialogueList] = useState([]);

    const parseScript = async () => {
        let input = test_json
        let result = await scriptToAudio(input)
        let response = await Promise.all(result.dialogue.map(async (element) => {
            let newAudio = await element.audio
            element.audio = newAudio
            return element
        }));
        console.log(response)
        setDialogueList(response)

        audioPlay(response, 0)
    }

    function start() {
        audioContext = new AudioContext()
        parseScript()
    }

    return (
        <section>
            <h1>Dev page</h1>
            <div>
                <button onClick={start}>Start</button>
            </div>

            <div>
                {dialogList.map((element, index) => (
                    <div key={index} >
                        <p>{element.speech}</p>
                    </div>
                    ))
                }
            </div>
        </section>
        );
}

export default DevScreen;

const test_json = `{
    "title": "Titanic Troubles",
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
    }
]
}`
