import {useState} from 'react';

const api_key = "5299cb48eefffcd273820af88db4ffcb"
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
//        element.audio = await Promise.resolve("www.audio.com")
    });
    return json
}

const audioPlay = async (url) => {
    const context = new AudioContext();
    const source = context.createBufferSource();
    const audioBuffer = await fetch(url)
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer));

    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start();
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
    }

    function start() {
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
                        <audio controls>
                            <source src={element.audio} type="audio/mpeg"/>
                        </audio>
                        <p>{JSON.stringify(element)}</p>
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
