import type { LocaleSlug } from "./localized-musebox";

export const a11yCopy:Record<LocaleSlug,{home:string;nav:string;menu:string;heroAlt:string;studioAlt:string}>={
  ja:{home:"Musebox ホーム",nav:"主なナビゲーション",menu:"メニューを開く",heroAlt:"画像から動画への安全な作例に使う、浜辺の成人モデル",studioAlt:"画像から動画への素材例として使う、スタジオの成人モデル"},
  ko:{home:"Musebox 홈",nav:"주요 메뉴",menu:"메뉴 열기",heroAlt:"사진을 영상으로 만드는 안전한 예시인 해변의 성인 모델",studioAlt:"사진 영상화 원본 예시인 스튜디오의 성인 모델"},
  "zh-hant":{home:"Musebox 首頁",nav:"主要導覽",menu:"開啟選單",heroAlt:"作為安全圖片轉影片範例的海灘成年模特兒",studioAlt:"作為圖片轉影片原始素材範例的棚拍成年模特兒"},
  es:{home:"Inicio de Musebox",nav:"Navegación principal",menu:"Abrir menú",heroAlt:"Modelo adulta en la playa como ejemplo seguro para pasar una foto a vídeo",studioAlt:"Modelo adulta en estudio como imagen de referencia para vídeo"},
  "pt-br":{home:"Página inicial do Musebox",nav:"Navegação principal",menu:"Abrir menu",heroAlt:"Modelo adulta na praia como exemplo seguro de foto para vídeo",studioAlt:"Modelo adulta em estúdio como imagem de referência para vídeo"},
  ru:{home:"Главная Musebox",nav:"Основное меню",menu:"Открыть меню",heroAlt:"Совершеннолетняя модель на пляже как безопасный пример исходника для видео",studioAlt:"Совершеннолетняя модель в студии как пример исходного изображения"},
  de:{home:"Musebox-Startseite",nav:"Hauptnavigation",menu:"Menü öffnen",heroAlt:"Erwachsenes Model am Strand als Beispiel für ein rechtmäßig nutzbares Ausgangsbild",studioAlt:"Erwachsenes Model im Studio als Beispiel für eine Bildvorlage"},
  fr:{home:"Accueil Musebox",nav:"Navigation principale",menu:"Ouvrir le menu",heroAlt:"Modèle adulte à la plage pour illustrer une source autorisée de vidéo",studioAlt:"Modèle adulte en studio comme exemple d'image de départ"},
  ar:{home:"الصفحة الرئيسية لموقع Musebox",nav:"التنقل الرئيسي",menu:"افتح القائمة",heroAlt:"عارضة بالغة على الشاطئ مثال لصورة مناسبة لصناعة فيديو",studioAlt:"عارضة بالغة في الاستوديو مثال لصورة مرجعية للفيديو"},
};

export const faqHeading:Record<LocaleSlug,string>={
  ja:"Musebox のよくある質問",ko:"Musebox 자주 묻는 질문","zh-hant":"Musebox 常見問題",es:"Preguntas frecuentes sobre Musebox","pt-br":"Dúvidas frequentes sobre o Musebox",ru:"Частые вопросы о Musebox",de:"Häufige Fragen zu Musebox",fr:"Questions fréquentes sur Musebox",ar:"أسئلة شائعة عن Musebox",
};

const urls=["https://musebox.ai/ai-video-generator/","https://playbox.website/","https://help.runwayml.com/hc/en-us/articles/37425232841875-Getting-Started-with-Generative-Video","https://kling.ai/quickstart","https://pika.art/faq","https://lumalabs.ai/llm-info","https://app.lumalabs.ai/dream-machine"];
const names:Record<LocaleSlug,string[]>={
  ja:["Musebox 公式動画生成ページ","Playbox 公式サイト","Runway 公式動画ドキュメント","Kling AI 公式入門","Pika 公式 FAQ","Luma 公式製品情報","Luma 公式制作アプリ"],
  ko:["Musebox 공식 영상 생성 페이지","Playbox 공식 사이트","Runway 공식 영상 문서","Kling AI 공식 시작 안내","Pika 공식 FAQ","Luma 공식 제품 정보","Luma 공식 제작 앱"],
  "zh-hant":["Musebox 官方影片生成頁","Playbox 官方網站","Runway 官方影片文件","Kling AI 官方入門","Pika 官方常見問題","Luma 官方產品資訊","Luma 官方製作介面"],
  es:["Página oficial de vídeo de Musebox","Sitio oficial de Playbox","Documentación oficial de Runway","Inicio rápido oficial de Kling AI","Preguntas frecuentes oficiales de Pika","Información oficial de Luma","Aplicación oficial de Luma"],
  "pt-br":["Página oficial de vídeo do Musebox","Site oficial do Playbox","Documentação oficial do Runway","Início rápido oficial do Kling AI","Perguntas frequentes oficiais do Pika","Informações oficiais da Luma","Aplicativo oficial da Luma"],
  ru:["Официальная страница видео Musebox","Официальный сайт Playbox","Официальная документация Runway","Официальное руководство Kling AI","Официальный FAQ Pika","Официальные сведения Luma","Официальное приложение Luma"],
  de:["Offizielle Videoseite von Musebox","Offizielle Playbox-Website","Offizielle Runway-Dokumentation","Offizieller Kling-AI-Schnellstart","Offizielle Pika-FAQ","Offizielle Luma-Produktinformationen","Offizielle Luma-Anwendung"],
  fr:["Page vidéo officielle de Musebox","Site officiel de Playbox","Documentation vidéo officielle de Runway","Guide officiel de Kling AI","FAQ officielle de Pika","Informations officielles de Luma","Application officielle de Luma"],
  ar:["صفحة الفيديو الرسمية لـMusebox","موقع Playbox الرسمي","وثائق Runway الرسمية للفيديو","دليل Kling AI الرسمي السريع","الأسئلة الرسمية لـPika","معلومات Luma الرسمية","تطبيق Luma الرسمي"],
};
export function localizedSourceName(locale:LocaleSlug,url:string,fallback:string):string {
  const index=urls.indexOf(url);
  return index>=0?names[locale][index]:fallback;
}
