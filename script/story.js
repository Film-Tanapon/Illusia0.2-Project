const screen = document.getElementById("screen")
const readBtn = document.getElementById("read-btn")
const pauseBtn = document.getElementById("pause-btn")
const characterBoxLeft = document.getElementById("character-box-left")
const characterBoxRight = document.getElementById("character-box-right")
const textBox = document.getElementById("text-box")
const storyText = document.getElementById("story-text")
const contiText = document.getElementById("conti-text")
const readbook_container = document.getElementById("readbook-container")
const book_text = document.getElementById("book-text")
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
const preloadBar = document.getElementById("preload-bar");
const preloadPercent = document.getElementById("preload-percent");
const loadingScreen = document.getElementById("load-image");

let currentScene = null;
let typeInterval = null;
let all_text = "";
let isTyping = false;
let advanceLock = false;
let hasFinishedTyping = false;


const story = {
    scene_1: {
        text: "\“แฮ่ก— แฮ่ก ..\” \nเหงื่อชื้นไหลซึมตั้งแต่ไรผม ลากผ่านทิ้งหยาดหยดจากปลายคาง ร่างกายตื่นตัวสุดขีด— อะดรีนาลีนพุ่งพล่านช่วยเร่งฝีเท้านั้นให้ก้าวยาวขึ้น ...",
        background : "../picture/background_story/scene_1.jpg", 
        next: "delay_scene_1_2"
    },
    delay_scene_1_2: {
        background : "../picture/background_story/delay_scene_1_2.jpg",
        next: "delay_scene_1_3",
        delay: 500
    },
    delay_scene_1_3: {
        background : "../picture/background_story/delay_scene_1_3.jpg",
        next: "delay_scene_1_4",
        delay: 500
    },
    delay_scene_1_4 : {
        background : "../picture/background_story/delay_scene_1_4.jpg",
        next: "delay_scene_1_5",
        delay: 500
    },
    delay_scene_1_5 : {
        background : "../picture/background_story/delay_scene_1_5.jpg",
        next: "scene_2",
        delay: 500
    },
    scene_2: {
        text: "‘ ตุบ— ’\nทุกอย่างตรงหน้าพลันดับมืด ประสาทสัมผัสทั้งหมดถูกตัดขาด สรรพางคกาย์สั่นสะท้าน มีเพียงลมหายใจสะดุดเท่านั้นที่คอยย้ำเตือนว่ายังมีชีวิตอยู่",
        background : "../picture/background_story/scene_2.jpg",
        next: "scene_3",
    },

    scene_3: {
        text: "\“ เฮือก—! \”",
        background : "../picture/background_story/scene_3.jpg",
        next: "scene_3_1"
    },

    scene_3_1: {
        text: "เปลือกตาเปิดขึ้นอีกครั้ง เพดานสีขาวอยู่ในครรลอง แผ่นหลังแนบไปกับผิวสัมผัสนุ่มของเตียง มือหนึ่งยังกำเสื้อตัวเองแน่นจนแทบจะฝากรอยฝังลงบนอก— สับสน เรื่องก่อนหน้าราวความฝันหลอกหลอน สายตากวาดมอง ความทรงจำไม่สมเหตุสมผลและเลือนราง ค่อย ๆ หยัดกายลุกเชื่องช้า ...",
        background : "../picture/background_story/scene_3.jpg",
        next: "scene_3_2"
    },

    scene_3_2: {
        text: "\“ เมื่อกี้มัน- อะไรน่ะ ...\nฝันร้ายเหรอ .. \”",
        background : "../picture/background_story/startroom.jpg",
        characterleft: "../picture/Character/Character01.png",
        delay_characterleft : 450,
        next: "scene_4"
    },

    scene_4: {
        text: "ภาพตรงหน้าคือห้องนอนใหญ่ สายตากวาดมองไปรอบ ๆ พลางเรียบเรียงเรื่องราวในหัว ความคุ้นเคยแทรกเข้ามาทีละน้อยทำให้มั่นใจมากกว่าห้าส่วน— ไม่ผิดแน่ นี่คือห้องนอนของบิดามารดา, ห้องที่ไม่มีใครได้รับอนุญาตใหถือครองกุญแจ ห้องที่กระทั่งลูกชายเช่นตนยังต้องแอบปลดกลอนเข้ามาอย่างเงียบเชียบ สวนลับของพวกท่าน ...",
        background : "../picture/background_story/startroom.jpg",
        next: "scene_5"
    },

    scene_5: {
        text: "\“ นี่ฉัน... เดินละเมอหรือยังไงกัน \”\n‘ เช่นนั้นแล้วบิดามารดาอยู่ที่ไหน ไฉนเลยตนจึงนอนบนหมอนนุ่มได้สบายใจเฉิบ— ’",
        background : "../picture/background_story/startroom.jpg",
        characterleft: "../picture/Character/Character02.png",
        delay_characterleft : 450,
        next: "scene_6"
    },

    scene_6: {
        text: "เมื่อทอดมองผ่านบานหน้าต่าง แสงจันทร์ทอผ่านบอกให้รู้ว่าราตรีล่วงเลยมาครึ่งค่อนคืนแล้ว ความทรงจำกลับคล้ายไร้ประโยชน์ หนำซ้ำยังทวีคูณความเคลือบแคลง สัญชาตญาณกู่ร้องว่าบางอย่างในนี้ไม่สมเหตุสมผล เมื่อในมือตนไร้อุปกรณ์ที่จะปลดกลอนประตูเสียด้วยซ้ำ ...",
        background : "../picture/background_story/startroom.jpg",
        choice1: {text : "สำรวจ",next : "explore_1"},
        choice2: {text : "ไม่สำรวจ",next : "scare_1"},
        choice_position_top1: "35%",
        choice_position_left1: "50%%",
        choice_position_top2: "55%",
        choice_position_left2: "50%"
    },

    explore_1: {
        text: "ความสงสัยเข้าเกาะกุม จึงเลือกที่จะไขว่คว้าหาคำตอบ— กระทำการตามใจตนเองเช่นไม่กลัวว่าจะถูกลงโทษ ขาก้าวลงจากเตียง ไล่สายตาสำรวจทั้งนิ้วมือจับต้อง ทุกอย่างใกล้เคียงความ ‘ ปรกติ ’ หากสมุดเล่มหนึ่งที่วางเด่นบนโต๊ะไม่ได้ดึงดูดให้ผินใบหน้ามองเสียก่อน",
        background : "../picture/background_story/explore/explore_1.jpg",
        next: "explore_2"
    },

    explore_2: {
        text: "มันเปื้อนรอยคราบแห้งกรังสีเข้ม เมื่อลากปลายนิ้วลูบผ่านยิ่งหยาบเย็น พลันนึกถึงความสกปรกยิ่งพาลให้ขยะแขยง ฝ่ามือหยิบมันขึ้นมาพลิกดูช้า ๆ หน้าปกไม่ได้บ่งบอกถึงความเป็นเจ้าของ หากอนุมานเอาจากสถานที่ที่มันอยู่ เช่นนั้นอาจเป็นของหนึ่งในบุพการีสักท่าน",
        background : "../picture/background_story/explore/explore_2.jpg",
        next: "explore_3"
    },

    explore_3: {
        text: "ใคร่รู้เสียเต็มประดา พลิกเปิดมันอย่างเชื่องช้า อาศัยแสงจันทร์ต่างโคมไฟ ส่วนหนึ่งในเบื้องลึกยังเกรงกลัว หากถูกโดนความลับที่ไม่มีใครรับรู้เข้า เช่นนั้นตนจะแสดงสีหน้าแบบไหนเมื่อต้องพบเจอกัน— ทว่าความจริงกลับไม่เป็นเช่นนั้น ลายมือที่ขีดเขียนดูคุ้นตาเกินกว่าจะเป็นของใครอื่น ยิ่งไล่นิ้วอ่านไปในแต่ละบรรทัด ทั้งช่วงเวลา ข้อความที่ไม่ปะติดปะต่อ และภาพภาพหนึ่ง ยิ่งคล้ายว่ามันจะชี้เข้ามาหาตน ...",
        background : "../picture/background_story/explore/explore_3.jpg",
        next: "explore_3_diary"
    },

    explore_3_diary: {
        diarytext: "๒๗ กันยายน\nล่วงเลยเข้าฤดูฝนแล้ว ลั่นทมผลิดอกใบบานท่ามกลางพายุโหมกระหน่ำ\nฉันมองเธอที่นั่งอยู่ข้างบานหน้าต่าง โดยไม่อาจรู้ได้เลยว่าเธอคิดอะไรอยู่ \nเธอดูแปลกไป ..\nในฤดูที่เธอโปรดปราน\nกลับคล้ายว่าเธอโอบกอดความโศกทั้งหมดไว้ในทรวง\n\n๘ ตุลาคม\nเธอจัดเตรียมสำรับอาหารเช่นปกติ ฉันแอบช่วยเหลือเธออยู่ห่าง ๆ \nก่อนจะถูกเรียกตัวไปที่อื่น ... \nเย็นวันนั้นฉันกลับมาเพื่อพบว่าเธอมีบาดแผล มันถูกพันทับด้วยผ้าขาว \nจากคำบอกเล่านั้นบอกว่าเธอเหม่อลอยจนเผลอทำคมบีดบาดตัวเอง \nฉันปลอบเธอ พยายามเอาตัวบังไม่ให้เธอถูกดุไปมากกว่านี้\n\n๒๐ ตุลาคม\nวันนี้ฝนตกหนักกว่าเคย เธอเก็บตัวอยู่ในห้องจนล่วงเลย\nถึงยามเย็น มื้ออาหารไม่ถูกแตะต้อง \nเธอเอ่ยบอกฉันเสียงเบาหวิวว่าเธอไม่ค่อยสบายเท่าใดนัก .. \nฉันเป็นห่วง จึงตัวติดเธอไม่ห่าง จนส่งเธอเข้านอนอีกครั้ง \n\n๑ พฤศจิกายน\nผืนนภาแจ่มใสหลังฝนคล้อยหาย เธอชวนฉันออกไปเดินเล่น \nเราซื้อขนมที่เธอชอบ ยืนมองลั่นทมริมทางที่ผลิใบใหม่ \nเสียงหัวเราะและรอยยิ้มเธอสะท้อนในนัยน์ตาฉัน .. \nนานแค่ไหนแล้วที่ไม่ได้เห็นความสว่างไสวจากเธอเช่นนี้ \nฉันอยากให้มันคงอยู่ตลอดไป ...\n\n๑๓ พฤศจิกายน\nเธอ ... (ข้อความไม่สามารถอ่านได้) แล้ว .. ในห้องของเธอ \nใบหน้าเธอดูมีความสุขมากกว่าทุกช่วงเวลาที่ผ่านมาเสียอีก\n\nหากฉันไม่ทิ้งเธอไว้ ...",
        background : "../picture/background_story/explore/explore_3.jpg",
        next: "explore_4"
    },

    explore_4: {
        text: "แต่กลับไร้ซึ่งความทรงจำ ช่วงเวลาตอนนี้นับเป็นเท่าใดจากบันทึก หรือเป็นแค่เรื่องราวเพ้อฝันที่สร้างในจินตนาการ— ไม่รู้และไม่เข้าใจ แผ่นหลังเหยียดตรง ประตูห้องอยู่ไม่ไกลเกินสิบก้าว เช่นนั้นคืนนี้ควรกลับไปพักผ่อนก่อนหรือไม่",
        background : "../picture/background_story/explore/explore_4.jpg",
        next: "explore_5"
    },

    explore_5: {
        text: "เมื่อก้าวออกมา ทางเดินตรงหน้ายังคงเป็นเช่นเดิม ห้องของตนอยู่สุดปลายทาง ด้านข้างคือบันไดไปสู่ชั้นล่าง ระหว่างนั้นมันถูกคั่นด้วยห้องนอนของอีกหนึ่งบุตรีผู้มีศักดิ์เป็นพี่สาว ...",
        background : "../picture/background_story/explore/explore_5.jpg",
        next: "explore_6"
    },

    explore_6: {
        text: "‘ ดึกดื่นเช่นนี้เธอจะหลับไปหรือยัง .. ’",
        background : "../picture/background_story/explore/explore_6.jpg",
        characterleft: "../picture/Character/Character03.png",
        delay_characterleft : 450,
        next: "explore_7"
    },

    explore_7: {
        text: "อาจเพราะความไม่สบายใจจากสมุดเล่มนั้น หรืออาจเพียงต้องการความอบอุ่นเหมือนอย่างที่เคย จึงตัดสินใจเดินตรงไปยังหน้าประตู หลังมือเคาะลงเบา ๆ ทว่าเมื่อไม่มีเสียงตอบรับ ฝ่ามือเคลื่อนไปกำรอบลูกบิด ออกแรงหมุนมันให้เปิดออก",
        background : "../picture/background_story/explore/explore_7.jpg",
        next: "explore_8"
    },

    explore_8: {
        text: "มันส่งเสียง ‘ แกร๊ก— ’ แต่กลับปิดสนิท นึกฉงน ‘ เช่นนั้นคงหลับแล้วกระมัง, โดยปรกติเธอเป็นคนเข้านอนแต่หัวค่ำอยู่แล้ว ’ ทอดถอนหายใจ พลันเหลือบมองยังห้องตัวเอง",
        background : "../picture/background_story/explore/explore_8.jpg",
        next: "explore_9"
    },

    explore_9: {
        text: "ปลายทางคือสุดทางเดิน ระยะห่างลดลงเรื่อย ๆ กระทั่งหยุดกายลงหน้าห้องของตน ในขณะที่กำลังจะเปิดประตูบานนั้น เสียงกุกกักที่ลอดผ่านทำให้ฝ่ามือหยุดชะงักกลางอากาศ ...",
        background : "../picture/background_story/explore/explore_9.jpg",
        next: "explore_10"
    },

    explore_10: {
        text: "แผ่นหลังยะเยือก ความกลัวระคนสงสัยแทรกซึมผ่านผิวหนัง หางตาสบกับบันไดที่อยู่ถัดไป ตราชั่งภายในจิตใจเอนเอียงไม่มั่นคง ..",
        background : "../picture/background_story/explore/explore_10.jpg",
        choice1: {text : "เปิดประตูห้องตรงหน้า",next : "explore_opendoor_1"},
        choice2: {text : "ลงไปชั้นล่าง",next : "explore_downstair_1"},
        choice_position_top1: "",
        choice_position_left1: "72%",
        choice_position_top2: "60%",
        choice_position_left2: "35%"
    },

    explore_opendoor_1: {
        text: "ลูกบิดคล้ายมวลน้ำแข็ง เมื่อปลายนิ้วแตะพาให้สะดุ้งออกในรอบแรก ก่อนกอบกุมและหมุนมันเปิดออกอย่างช้า ๆ ตรงกันข้ามกับเสียงดังระรัวของจังหวะชีพจร",
        background : "../picture/background_story/explore_opendoor_1.jpg",
        next: "explore_opendoor_2"
    },

    explore_opendoor_2: {
        text: "บานประตูเผยให้เห็นห้องด้านใน ยามราตรีที่แสงจันทร์สาดทอ มันทาบทับร่างหญิงสาวในอาภรณ์สีขาวนวล รับกับเรือนผมดังนิลกาฬ เงาผีเสื้อรายล้อมดอมดมผกาสีชาด— เธอวาดรอยยิ้มแย้มให้อย่างอ่อนโยน ...",
        background : "../picture/background_story/explore_opendoor_2.jpg",
        next: "to_be_continue"
    },

    explore_downstair_1: {
        text: "ผินใบหน้ามองลงไปยังชั้นล่าง การไม่ประเชิญหน้าอาจเป็นทางเลือกที่ดีกว่า ในกรณีที่ต้นตอเสียงในนั้นเป็นสิ่งไม่คาดฝัน— ขาก้าวลงจากบันไดทีละขั้น .. ทีละขั้นจนพ้น เหยียบลงบนพื้น สายตาคุ้นชินกับความมืดจึงมองเห็นเพียงเงาลาง ๆ มือยกมาคลำทางเพื่อหาเส้นทางต่อไป ...",
        background : "../picture/background_story/downstair.jpg",
        next: "to_be_continue"
    },

    scare_1: {
        text: "‘ หากพวกท่านรู้เข้า— ไม่พ้นต้องโดนดุแน่ .. ’",
        background : "../picture/background_story/startroom.jpg",
        next: "scare_2"
    },

    scare_2: {
        text: "คำสั่งสอนว่าไม่ควรเข้ามาเล่นในห้องนี้ไม่อาจฝังลึกได้เท่าบทลงโทษที่ร่างกายจดจำ ลมหายใจสูดลึก สายตาเริ่มคุ้นชินกับความมืด พลันสังเกตเห็นเงาดำตรงมุมห้อง— ยิ่งเพ่งความสนใจ ‘ มัน ’ ยิ่งแสยะยิ้มมอบให้อย่างน่าสยดสยอง",
        background : "../picture/background_story/scare/scare_2.jpg",
        next: "black1_scare_2"
    },

    black1_scare_2:{
        background : "",
        next: "ghostpop1_scare_2",
        delay: 100
    },

    ghostpop1_scare_2: {
        background : "../picture/background_story/scare/ghostpop1_scare_2.jpg",
        next: "black2_scare_2",
        delay: 750
    },

    black2_scare_2:{
        background : "",
        next: "ghostpop2_scare_2",
        delay: 100
    },

    ghostpop2_scare_2: {
        background : "../picture/background_story/scare/ghostpop2_scare_2.jpg",
        next: "black3_scare_2",
        delay: 750
    },

    black3_scare_2:{
        background : "",
        next: "ghostpop3_scare_2",
        delay: 100
    },

    ghostpop3_scare_2: {
        background : "../picture/background_story/scare/ghostpop3_scare_2.jpg",
        next: "black3_scare_3",
        delay: 750
    },

    black3_scare_3:{
        background : "",
        next: "scare_3",
        delay: 100
    },

    scare_3: {
        text: "ดวงตาเบิกโพลง ความกลัวเสียดแทงลึกถึงกระดูก ลมหายใจสั่นกระชั้น— ‘ มัน ’ ยังคงอยู่นิ่งเช่นรอคอย ฉีกยิ้มกว้าง, ปลายเท้าก้าวถอยอย่างระวัง ในขณะที่สายตายังตรึงไว้ไม่กะพริบ ราวหากเผลอไปเพียงเสี้ยววินาที มันจะกระโจนเข้ามาขย้ำจนไม่เหลือชิ้นดี",
        background : "../picture/background_story/scare/scare_2.jpg",
        character: "../picture/Character/Character04.png",
        delay_character : 450,
        next: "scare_4",
    },

    scare_4: {
        text: "เมื่อระยะห่างจากประตูลดลงมากพอ สองขาพุ่งไปอย่างไม่คิดชีวิต แรงทั้งหมดโถมใส่ลูกบิด ประตูกระแทกเปิดเสียงดังลั่น ทิ้งกายถลาไปกับทางเดินด้านนอกในคราวเดียว เสียง ‘ ปัง—! ’ ไล่หลังก้องสะท้อน ดังแข่งกับชีพจรระรัวในอก",
        background : "../picture/background_story/scare/scare_2.jpg",
        next: "scare_5"
    },

    scare_5: {
        text: "ทางเดินทอดยาวไปข้างหน้า แสงตกกระทบสร้างเงาให้ชวนสยอง สุดปลายทางคือห้องที่คุ้นเคย— ห้องนอนของตัวเอง, ระหว่างนั้นคือบานประตูห้องของเธอผู้มีศักดิ์เป็นพี่ มือรีบยันตัวเองขึ้น คาดหวังไอความอบอุ่นจากเธอปลอบประโลมให้ความตระหนกจางลงไป",
        background : "../picture/background_story/scare/scare_5.jpg",
        next: "scare_6"
    },

    scare_6: {
        text: "ไหล่กระแทกประตูต่างการเคาะ มือเอื้อมหมุนลูกบิดอย่างเร่งรีบกอปรรวมกับหวาดกลัว ... ",
        background : "../picture/background_story/scare/scare_6.jpg",
        next: "scare_7"
    },

    scare_7: {
        text: "มันส่งเสียง ‘ แกร๊ก— ’ ทว่ากลอนกลับล็อกสนิท เมื่อหมุนแรงขึ้นอีกครั้ง กลไกด้านในกลับยิ่งแน่นกว่าเดิม คล้ายยิ่งพยายามมากเท่าไร มันก็ยิ่งต้านไม่ให้เปิดออกมากขึ้นเท่านั้น ...",
        background : "../picture/background_story/scare/scare_7.jpg",
        next: "scare_8"
    },

    scare_8: {
        text: "ตัดสินใจหันมองยังสุดสายตา ฝีเท้าก้าวยาวรีบร้อน จนหยุดยืนหน้าห้องตัวเอง ในขณะที่ฝ่ามือกำลังเอื้อมไปกอบกุมรอบลูกบิด เสียงกุกกักดังลอดผ่านทำให้จำต้องชะงักค้างกลางอากาศ",
        background : "../picture/background_story/scare/scare_8.jpg",
        next: "scare_9"
    },

    scare_9: {
        text: "ถูกบีบจนไม่เหลือทางเลือกใด— เหลือบมองลงไปยังบันไดด้านข้าง ความลังเลพาดผ่านเพียงเสี้ยววินาที ก่อนความกลัวเข้ากัดกินแทนที่ ...",
        background : "../picture/background_story/scare/scare_9.jpg",
        next: "scare_downstair_1"
    },

    scare_downstair_1: {
        text: "บันไดทอดยาวลงไปสู่ชั้นล่าง ข้าวก้าวลงทีละขั้น ... ทีละขั้นอย่างเชื่องช้า ดังกลัวว่าหากส่งเสียงดัง ต้นตอเสียงกุกกักในห้องนั้นจะรู้ตัวขึ้นมา— บรรยากาศมืดมิดแผ่ตัวโอบล้อม ยามเมื่อสายตาเห็นเส้นทางเป็นเงาจาง มือจึงคลำเพื่อหาทางออก ...",
        background : "../picture/background_story/downstair.jpg",
        next: "to_be_continue"
    },

    to_be_continue: {
        text : "โปรดติดตามในเวอร์ชันถัดไป...",
        background : "",
        next: ""
    }

};

function preloadAllImages(storyObj, callback) {
    const images = [];
    for (const key in storyObj) {
        const scene = storyObj[key];
        if (scene.background) images.push(scene.background);
        if (scene.characterleft) images.push(scene.characterleft);
        if (scene.characterright) images.push(scene.characterright);
    }

    const total = images.length;
    let loaded = 0;

    images.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = img.onerror = () => {
            loaded++;
            const percent = Math.round((loaded / total) * 100);
            preloadBar.style.width = percent + "%";
            preloadPercent.textContent = percent + "%";

            if (loaded === total) {
                setTimeout(() => {
                    loadingScreen.style.display = "none";
                    callback();
                }, 500);
            }
        };
    });

    if (images.length === 0) {
        loadingScreen.style.display = "none";
        callback();
    }
}

function loadScene(scene){
    currentScene = scene;
    const sceneData = story[scene];
    storyText.textContent = "";

    preloadNextImages(currentScene, 5);

    readbook_container.style.display = "none";
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
            if (sceneData.next) loadScene(sceneData.next);
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
        setTimeout(()=>{
            readBtn.style.display = "flex";
            pauseBtn.style.display = "flex";
            advanceLock = false;
            typeWriter(sceneData.text, () => {
                contiText.style.display = "flex";
            });
        }, sceneData.delaytext || 500);
    }
    
    if (sceneData.diarytext){
        advanceLock = false;
        readbook_container.style.display = "flex";
        book_text.innerHTML = sceneData.diarytext.replace(/\n/g, "<br>");
    }
}


function typeWriter(text, callback){
    let i = 0;
    storyText.textContent = "";
    isTyping = true;
    hasFinishedTyping = false;
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
            if (!hasFinishedTyping) {
                allText.innerHTML += storyText.innerHTML + "<br><br>";
                hasFinishedTyping = true;
                }
            callback?.();
        }
    }, delayLetter)
}

function fullText(text){
    clearInterval(typeInterval);
    isTyping = false;
    storyText.innerHTML = text.replace(/\n/g, "<br>");
    if (!hasFinishedTyping) {
        allText.innerHTML += text.replace(/\n/g, "<br>") + "<br><br>";
        hasFinishedTyping = true;
    }
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
        choiceBtn1.style.left = sceneData.choice_position_left1;
        choiceBtn1.onclick = () => {
            if (advanceLock) return;
            advanceLock = true;
            loadScene(sceneData.choice1.next);
        };
    }
    if (sceneData.choice2) {
        choiceBtn2.style.display = "flex";
        choiceBtn2.innerHTML = sceneData.choice2.text;
        choiceBtn2.style.top = sceneData.choice_position_top2;
        choiceBtn2.style.left = sceneData.choice_position_left2;
        choiceBtn2.onclick = () => {
            if (advanceLock) return;
            advanceLock = true;
            loadScene(sceneData.choice2.next);
        };
    }
}

function proceedStory() {
    if (advanceLock || isTyping) return;
    const sceneData = story[currentScene];

    if (currentScene === "end") {
        window.location.href = "index.html";
        return;
    }

    if (sceneData.choice1 || sceneData.choice2) {
        choiceSetup(sceneData);
    } else if (sceneData.next) {
        advanceLock = true;
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
        if (scene.characterleft) {
            const img = new Image();
            img.src = scene.characterleft;
        }
        if (scene.characterright) {
            const img = new Image();
        img.src = scene.characterright;
        }
    });
}

readbook_container.addEventListener("click", () => {
    if (advanceLock) return;
    readbook_container.style.display = "none";
    proceedStory();
});

textBox.addEventListener("click", () => {
    if (advanceLock) return;
    if (isTyping) {
        fullText(story[currentScene].text);
    } else {
        proceedStory();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        if (advanceLock) return;
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

background.addEventListener("click",() =>{
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

window.addEventListener("load", () => {
    preloadAllImages(story, () => {
        loadScene("scene_1");
    });
});