import {useState, useEffect} from 'react';

const api_key = "5299cb48eefffcd273820af88db4ffcb"
const voice_id = "fzeqLIhdPlhpbb0XeGhf"

const textToSpeech = async (inputText) => {
    let options = {
        method: 'POST',
        headers: {
            'xi-api-key': api_key,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: `{"text": "${inputText}"}`
    };

    return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, options)
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .catch(err => console.error(err));
}


function DevScreen() {

    const [audioString, setAudioString] = useState(null);
    const handleAudioFetch = async () => {
        const data = await textToSpeech("I looooove trucks")
        console.log(data)
        setAudioString(data);
    };

    // Use the useEffect hook to call the handleAudioFetch function once when the component mounts
    useEffect(() => {
        handleAudioFetch()
    }, []);

    return (
        <section>
            <h1>Dev page</h1>
            <div>
                {audioString && (
                    <audio autoPlay controls>
                        {/*<source src={`data:audio/ogg;base64,${audioString}`}/>*/}
                        <source src={audioString} type="audio/mpeg"/>
                    </audio>
                    )}
            </div>
        </section>
        );
}

export default DevScreen;