import { PageTemplate } from "../../components/PageTempalte";
import { useGameContext } from "../../context/GameContext";
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

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const scriptToAudio = async (jsonScript) => {
//  let json = JSON.parse(jsonScript)
  let json = jsonScript

  for (let i = 0; i < json.dialogue.length; i++) {
    let element = json.dialogue[i]
    let speech = element.speech
    element.audio = textToSpeech(speech, element.voiceId)
    await sleep(1000);

//    element.audio = await Promise.resolve("https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-0.mp3")
  }

  return json
}

function GameHost() {
  const { gameScript } = useGameContext();

  const [dialogList, setDialogueList] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [background, setBackground] = useState(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const parseScript = async () => {
//    let input = test_json //TODO: Get from other screens
    let input = gameScript
    let result = await scriptToAudio(input)
    setBackground(result.background_url)
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
      if(entry.name != "Narrator" && !characters.map((char) => char.name).includes(entry.name)) {
        characters.push(entry)
      }
    })
    console.log(`Characters: ${characters}`)
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
          { !started && !finished ? <button onClick={start}>Start</button>:  <p></p> }

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

export default GameHost;

const test_json = `{
    "title": "Titanic Troubles",
    "background_url": "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlJTIwc2hvcCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
    "dialogue": [
        {
            "name": "Narrator",
            "voiceId": "cKx1nyNQBkX7cXitLRzo",
            "speech": "A cozy coffee shop in Amsterdam, bustling with customers. Caffeinated chatter and the aroma of freshly brewed coffee fill the space. NORMA (70s, Russian accent) sits at a corner table, sipping her drink and passionately typing on her laptop. STEVE (40s, accountant) stands behind the counter, meticulously arranging coffee cups."
        },
        {
            "name": "Narrator",
            "voiceId": "cKx1nyNQBkX7cXitLRzo",
            "speech": "ROLAND (60s, Southern accent) enters the coffee shop, wearing his trademark trucker cap and plaid shirt. He spots Norma, waves, and joins her at the table."
        },
        {
            "name": "Roland",
            "voiceURI": "Ralph",
            "voiceId": "mIbUdNBiJryF43xFXqOl",
            "personality": "Old southern American man, Loves trucks",
            "isAI": false,
            "speech": "..."
        },
        {
            "name": "Norma",
            "voiceUri": "Ellen",
            "voiceId": "xNGR0IG7oSi0Xxc2I7DV",
            "personality": "Old russian woman, loves her grandchildren",
            "isAI": true,
            "direction": "excitedly",
            "speech": "Oh, Roland! Just got an email from my grandchildren. They're coming to visit from Moscow next week!"
        },
        {
            "name": "Roland",
            "voiceURI": "Ralph",
            "voiceId": "mIbUdNBiJryF43xFXqOl",
            "personality": "Old southern American man, Loves trucks",
            "isAI": false,
            "speech": "..."
        },
        {
            "name": "Narrator",
            "voiceId": "cKx1nyNQBkX7cXitLRzo",
            "speech": "STEVE (leaning over the counter)"
        },
        {
            "name": "Narrator",
            "voiceId": "cKx1nyNQBkX7cXitLRzo",
            "speech": "Congratulations, Norma! That's great news. Family time is the best."
        },
        {
            "name": "Narrator",
            "voiceId": "cKx1nyNQBkX7cXitLRzo",
            "speech": "Norma's face beams with pride and joy."
        },
        {
            "name": "Norma",
            "voiceUri": "Ellen",
            "voiceId": "xNGR0IG7oSi0Xxc2I7DV",
            "personality": "Old russian woman, loves her grandchildren",
            "isAI": true,
            "direction": "sincerely",
            "speech": "Thank you, Steve. My grandchildren mean everything to me. We shall bake pirozhki and share stories of their parents."
        },
        {
            "name": "Steve",
            "voiceURI": "Fred",
            "voiceId": "D9Thk1W7FRMgiOhy3zVI",
            "personality": "Accountant, Loves numbers, Universally adored",
            "isAI": true,
            "direction": "sincerely",
            "speech": "That sounds lovely, Norma. Family traditions are rich with love and memories."
        },
        {
            "name": "Roland",
            "voiceURI": "Ralph",
            "voiceId": "mIbUdNBiJryF43xFXqOl",
            "personality": "Old southern American man, Loves trucks",
            "isAI": false,
            "speech": "..."
        },
        {
            "name": "Norma",
            "voiceUri": "Ellen",
            "voiceId": "xNGR0IG7oSi0Xxc2I7DV",
            "personality": "Old russian woman, loves her grandchildren",
            "isAI": true,
            "direction": "chuckling",
            "speech": "Ah, Roland. It's a tale as wild as the Russian winters. I followed love, leaving behind the frostbite for tulips and canals."
        },
        {
            "name": "Steve",
            "voiceURI": "Fred",
            "voiceId": "D9Thk1W7FRMgiOhy3zVI",
            "personality": "Accountant, Loves numbers, Universally adored",
            "isAI": true,
            "direction": "smiling",
            "speech": "This is why I love this place. So many stories and diverse backgrounds, all gathered over a cup of Joe."
        },
        {
            "name": "Narrator",
            "voiceId": "cKx1nyNQBkX7cXitLRzo",
            "speech": "The customers around them smile and nod in agreement."
        },
        {
            "name": "Roland",
            "voiceURI": "Ralph",
            "voiceId": "mIbUdNBiJryF43xFXqOl",
            "personality": "Old southern American man, Loves trucks",
            "isAI": false,
            "speech": "..."
        },
        {
            "name": "Narrator",
            "voiceId": "cKx1nyNQBkX7cXitLRzo",
            "speech": "They clink their cups together, celebrating their unique bond and the melting pot of cultures that Amsterdam embodies."
        },
        {
            "name": "Narrator",
            "voiceId": "cKx1nyNQBkX7cXitLRzo",
            "speech": "Norma, Steve, and Roland continue chatting, sharing laughs and stories. The coffee shop remains a place where friendship bonds are forged and the world feels smaller."
        }
]
}`