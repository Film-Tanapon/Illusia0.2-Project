const screen = document.getElementById("screen")
const readBtn = document.getElementById("read-btn")
const pauseBtn = document.getElementById("pause-btn")
const characterBoxLeft = document.getElementById("character-box-left")
const characterBoxRight = document.getElementById("character-box-right")
const textBox = document.getElementById("text-box")
const storyText = document.getElementById("story-text")
const contiText = document.getElementById("conti-text")
const choices = document.getElementById("choices")
const choiceBtn1 = document.getElementById("choice-1")
const choiceBtn2 = document.getElementById("choice-2")
const background = document.getElementById("background")
const allTextBox = document.getElementById("alltext-box")
const allText = document.getElementById("all-text")
const exitTextBtn = document.getElementById("exit-text-btn")
const pauseMenu = document.getElementById("pause-menu")
const resumeBtn = document.getElementById("resume-btn")
const restartBtn = document.getElementById("restart-btn")
const mainBtn = document.getElementById("main-btn")


let currentScene = null;
let typeInterval = null;
let all_text = "";

const story = {
    scene_1: {
        text: "\"แฮ่ก- แฮ่ก ..\"\nร่างกายคุณอาบชุ่มไปด้วยเหงื่อ เสียงลมหวีดหวิวสวนทางกับคุณที่พุ่งตรงไปด้านหน้า อะดรีนาลีนที่หลั่งทำให้ฝีเท้าคุณก้าวยาวขึ้น คุณวิ่งเร็วขึ้นเรื่อย ๆ จนกระทั่ง ..",
        background : "https://github.com/Film-Tanapon/Illusia-Project/blob/main/picture/Scene_1.png?raw=true",
        next: "scene_2"
    },

    scene_2: {
        text: "‘ ตุบ- ’\nสายตาคุณมืดมิด ประสาทการรับรู้ถูกปิดกั้นด้วยบางสิ่ง คล้ายลมหายใจจะพาลสะดุดไปด้วย",
        background : "",
        next: "scene_3_cutscene",
    },

    scene_3_cutscene: {
        text: "เมื่อคุณลืมตาขึ้นมาอีกครั้ง คุณกลับเห็นเพดานห้องสีขาว ตัวคุณนอนราบอยู่บนเตียง ขยำเสื้อตัวเองจนแทบจิกเข้าเนื้อ- เหงื่อกาฬคุณไหลซึมจนเปียกชื้น คุณค่อย ๆ หยัดกายลุกขึ้นเชื่องช้า",
        background : "",
        next: "scene_4"
    },

    scene_4: {
        text: "ภาพตรงหน้าเรียกได้ว่าเป็นห้องนอนห้องหนึ่ง คุณกวาดสายตามองไปรอบ ๆ ความคุ้นเคยที่เพิ่มขึ้นทีละน้อยทำให้คุณมั่นใจ- ไม่ผิดแน่ นี่คือห้องของพ่อแม่คุณ, ห้องที่คุณไม่ได้รับอนุญาตให้เข้ามาได้โดยง่าย ห้องที่คุณจำต้องแอบเข้ามาอย่างเงียบเชียบ แต่ความทรงจำที่เลือนรางกลับชวนให้คุณรู้สึกว่ามันประหลาด ...",
        background : "",
        character: "https://cdn.discordapp.com/attachments/1408368721583538176/1413750992821944391/IMG_6585.png?ex=68bd11b6&is=68bbc036&hm=c224492325ef63cf8a5a1b0a501e1054392c6f09cd91a83d877f660ca1d8e0e9",
        delay_character : 0,
        choice1: {text : "สำรวจห้องนอน",next : "explore_1"},
        choice2: {text : "ไม่สำรวจห้องนอน",next : "scare_1_cutscence"},
        choice_position_top1: "",
        choice_position_right1: "",
        choice_position_top2: "",
        choice_position_right2: ""
    },

    explore_1: {
        text: "คุณตัดสินใจทำลายความสงสัยด้วยการสำรวจ เช่นวัยอยากรู้อยากเห็น- เพียงแต่มีจังหวะชีพจรที่อาจถูกพรากไปได้ทุกเมื่อเข้ามาเกี่ยวข้องเท่านั้น, คุณกวาดสายตา มือไล่ไปตามตู้เตียง ทุกอย่างดูปกติ เว้นเสียแต่สมุดเล่มหนึ่งที่วางเด่นกลางโต๊ะไม้ สภาพมันคล้ายใกล้จะพังเต็มที คุณหยิบมันขึ้นมา",
        background : "",
        next: "explore_2"
    },

    explore_2: {
        text: "หน้าสมุดมีรอยเปรอะเปื้อนสีน้ำตาลเข้ม คุณใช้ปลายนิ้วลูบผ่าน มันแห้งกรัง- จำเป็นจับมันด้วยสองมือเพื่อเปิดอ่าน ภายในมีเพียงรูปภาพจาง ๆ หนึ่งรูปและข้อความที่คล้ายประวัติส่วนตัว หน้ากระดาษบางส่วนขาดหายไป",
        background : "",
        next: "explore_3"
    },

    explore_3: {
        text: "คุณใช้เวลาในการอ่านราวหลายนาที เนื้อหาในนั้นไม่ต่างจากสมุดบันทึกทั่วไปที่คุณพอจะคาดเดาได้ ทอดถอนหายใจก่อนเงยหน้าขึ้นมา ประตูห้องอยู่ตรงหน้าคุณ- แม้จะยังสับสน แต่หากไม่ออกไปข้างนอกคงได้ติดอยู่ในห้องนี้ตลอดไปแน่",
        background : "",
        character: "",
        delay_character : 0,
        next: "explore_4"
    },

    explore_4: {
        text: "คุณก้าวขาออกมาด้านนอก ภาพตรงหน้าคือทางเดินทอดยาวไปสุดปลายทางอันคือห้องนอนคุณเอง แต่ระหว่างนั้นจำต้องผ่านห้องหนึ่งไปก่อน ทว่าเมื่อคุณลองเปิดประตูกลับพบว่ามันถูกล็อคเอาไว้ คุณขมวดคิ้วอย่างฉงน- ทางเลือกถูกตัดออกไป ตอนนี้คุณจึงยืนอยู่หน้าห้องนอนของคุณ เสียงกุกกักด้านในดังลอดผ่านมาให้คุณได้ยิน ฝ่ามือคุณชะงัก พลันหันมองไปยังบันไดข้าง ๆ",
        background : "",
        character: "",
        delay_character : 0,
        choice1: {text : "เปิดประตูห้องตรงหน้า",next : "explore_opendoor_cutscence"},
        choice2: {text : "ลงไปชั้นล่าง",next : "explore_downstair"},
        choice_position_top1: "",
        choice_position_right1: "",
        choice_position_top2: "",
        choice_position_right2: ""
    },

    explore_opendoor_cutscence: {
        text: "คุณกลั้นใจผลักบานประตูเข้าไป ภาพตรงหน้าคือแสงจันทร์สาดกระทบลงบนเรือนร่างหญิงสาว เธอใส่ชุดสีขาวนวล เมื่อคุณเลื่อนสายตาขึ้นสบ จึงได้พบกับพี่สาวที่ยิ้มให้คุณอย่างอ่อนโยน ...",
        background : "",
        next: ""
    },

    explore_downstair: {
        text: "คุณตัดสินใจเลือกลงไปข้างล่างแทน- หากว่าเกิดเป็นโจรขึ้นบ้าน คุณมั่นใจว่าคงหนีสะดวกกว่าในพื้นที่โล่งตรงห้องรับแขก เมื่อก้าวลงมาจากบันไดขั้นสุดท้าย คุณมองสำรวจ เพื่อเลือกเส้นทางที่ตัวเองจะเดินหน้าต่อไป ... ",
        background : "",
        character: "",
        delay_character : 0,
        next: "to_be_continue"
    },

    scare_1_cutscence: {
        text: "‘ห้องของบิดามารดาย่อมไม่ใช่สนามเด็กเล่น’ ทุกครั้งที่คุณถูกจับได้ คุณจะโดนทำโทษตั้งแต่เล็กน้อยจนมากขึ้นเรื่อย ๆ ส่วนหนึ่งในร่างกายคุณจึงจดจำ คุณปรับสายตาเข้ากับความมืด ฉับพลัน- คุณสังเกตเห็นเงาตะคุ่มบางอย่างที่มุมห้องอันมืดมิด สิ่งที่คล้ายปากฉีกยิ้มให้คุณ",
        background : "",
        next: "scare_2"
    },

    scare_2: {
        text: "ด้วยความตกใจสุดขีด คุณพุ่งตรงไปยังประตู กระแทกเปิดด้วยแรงทั้งหมดที่มี, ตัวคุณถลาไปกับทางเดินหน้าห้อง สุดปลายสายตาคือห้องนอนของคุณ แม้ระหว่างทางจะถูกคั่นด้วยห้องพี่สาว แต่กลอนประตูกลับถูกล็อค บังคับคุณให้ไม่มีทางเลือกนอกจากวิ่งตรงไปข้างหน้า ...",
        background : "",
        character: "",
        delay_character : 0,
        next: "scare_3"
    },

    scare_3: {
        text: "คุณสาวเท้าก้าวอย่างรีบร้อน ความกลัวกลั่นตัวเป็นหยดเหงื่อเย็น จนหยุดยืนอยู่หน้าบานประตู มือคุณที่กำลังเอื้อมหยุดค้างกลางอากาศ- ใบหูคุณได้ยินเสียงดังแว่วลอดผ่านช่องประตู มันดังมาจากข้างในนั้น ทางเลือกคุณมีไม่เหลือแล้ว",
        background : "",
        character: "",
        delay_character : 0,
        next: "scare_downstair",
    },

    scare_downstair: {
        text: "การเอาชนะความกลัวหลังจากผ่านเหตุการณ์ชวนขนหัวลุกนั้นเป็นเรื่องยากเกินไป คุณเลือกที่จะลงไปข้างล่างแทนที่จะฝืนแรงไปเปิดประตู ลงมาจนสุดท้ายของขั้นบันได หากแต่ค่ำคืนนี้ยังไม่จบ มันยังเหลือเส้นทางให้คุณเลือกตัดสินใจอีกหลังจากนี้ ...",
        background : "",
        character: "",
        delay_character : 0,
        next: "to_be_continue"
    },

    to_be_continue: {
        background : "",
        next: ""
    }

};

function loadScene(scene){
    currentScene = scene;
    const sceneData = story[scene];
    storyText.textContent = "";

    preloadNextImages(currentScene, 5);

    readBtn.style.display = "none";
    pauseBtn.style.display = "none";
    textBox.style.display = "none";
    contiText.style.display = "none";
    characterBoxLeft.style.display = "none";
    characterBoxRight.style.display = "none";
    choiceBtn1.style.display = "none";
    choiceBtn2.style.display = "none";

    document.body.style.backgroundImage = `url(${sceneData.background})`;

    if (sceneData.delay) {
        setTimeout(() => {
            if (sceneData.next) loadStory(sceneData.next);
        }, sceneData.delay);
        return;
    }

    if (sceneData.characterleft) {
        setTimeout(() => {
            characterBoxLeft.style.backgroundImage = `url(${sceneData.characterleft})`;
            characterBoxLeft.style.display = "flex";
        }, sceneData.delay_characterleft || 0);
    }

    if (sceneData.characterright) {
        setTimeout(() => {
            characterBoxRight.style.backgroundImage = `url(${sceneData.characterright})`;
            characterBoxRight.style.display = "flex";
        }, sceneData.delay_characterright || 0);
    }

    if (sceneData.text){
    // รอ delay ก่อนค่อยเริ่ม typewriter
        setTimeout(()=>{
            readBtn.style.display = "flex";
            pauseBtn.style.display = "flex";
            typeWriter(sceneData.text, () => {
                contiText.style.display = "flex";
            });
        }, sceneData.delaytext || 0);
    }  
}


function typeWriter(text, callback){
    let i = 0;
    storyText.textContent = "";
    isTyping = true;
    textBox.style.display = "flex";
    let textSpeed = localStorage.getItem('textSpeed') || 5;
    let delayLetter = 60;
    if(textSpeed == 1){
        delayLetter = 120;
    }else if(textSpeed == 2){
        delayLetter = 60;
    }else if(textSpeed == 3){
        delayLetter = 30;
    }

    typeInterval = setInterval(() => {
        if(text.charAt(i) === "\n") {
            storyText.innerHTML += "<br>";
        }else{
            storyText.innerHTML += text.charAt(i);
        }
        i++;
        if (i >= text.length) {
            clearInterval(typeInterval);
            isTyping = false;
            allText.innerHTML += storyText.innerHTML + "<br><br>";
            callback?.();
        }
    }, delayLetter)

}

function fullText(text){
    clearInterval(typeInterval);
    isTyping = false;
    storyText.innerHTML = text.replace(/\n/g, "<br>");
    allText.innerHTML += text.replace(/\n/g, "<br>") + "<br><br>";
    contiText.style.display = "flex";
}

function choiceSetup(sceneData) {
    textBox.style.display = "none";
    contiText.style.display = "none";
    characterBoxLeft.style.display = "none";
    characterBoxRight.style.display = "none";

    if (sceneData.choice1) {
        choiceBtn1.style.display = "flex";
        choiceBtn1.innerHTML = sceneData.choice1.text;
        choiceBtn1.style.top = sceneData.choice_position_top1;
        choiceBtn1.style.right = sceneData.choice_position_right1;
        choiceBtn1.onclick = () => loadScene(sceneData.choice1.next);
    } else {
        choiceBtn1.style.display = "none";
    }

    if (sceneData.choice2) {
        choiceBtn2.style.display = "flex";
        choiceBtn2.innerHTML = sceneData.choice2.text;
        choiceBtn2.style.top = sceneData.choice_position_top2;
        choiceBtn2.style.right = sceneData.choice_position_right2;
        choiceBtn2.onclick = () => loadScene(sceneData.choice2.next);
    } else {
        choiceBtn2.style.display = "none";
    }
}

function proceedStory() {
  const sceneData = story[currentScene];
  if (isTyping) return;

  // ตรวจสอบว่าฉากสุดท้าย
  if (currentScene === "end") {
    window.location.href = "index.html"; // กลับไปหน้า index.html
    return;
  }

  if (sceneData.choice1 || sceneData.choice2) {
        choiceSetup(sceneData);
    } else if (sceneData.next) {
        loadScene(sceneData.next);
    }
}

function preloadNextImages(currentScene, count = 5) {
    const keys = Object.keys(story);
    const index = keys.indexOf(currentScene);

    if (index === -1) return;

    const nextKeys = keys.slice(index + 1, index + 1 + count);

    nextKeys.forEach(key => {
        const scene = story[key];
        if (scene.background) {
            const img = new Image();
            img.src = scene.background;
        }
        if (scene.character) {
            const charImg = new Image();
            charImg.src = scene.character;
        }
    });
}

textBox.addEventListener("click", () => {
    if (isTyping) {
        fullText(story[currentScene].text);
    }else{
        proceedStory();
    }
});

document.addEventListener("keydown", (e) => {
    if(e.code === "Space"){
        e.preventDefault();
        if (isTyping) {
            fullText(story[currentScene].text);
        } else {
            proceedStory();
        }
    }
});

readBtn.addEventListener("click",() =>{
    background.style.display = "flex";
    allTextBox.style.display = "flex";
});

exitTextBtn.addEventListener("click",() =>{
    background.style.display = "none";
    allTextBox.style.display = "none";
});

pauseBtn.addEventListener("click",() =>{
    background.style.display = "flex";
    pauseMenu.style.display = "flex";
});

resumeBtn.addEventListener("click",() =>{
    background.style.display = "none";
    pauseMenu.style.display = "none";
});

restartBtn.addEventListener("click",() =>{
    window.location.reload();
});

mainBtn.addEventListener("click",() =>{
    window.location.href="index.html";
});

window.addEventListener("load", () => loadScene("scene_1"));