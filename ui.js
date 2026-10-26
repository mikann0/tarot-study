window.UI = {
ja:{
 appName:"タロット学習帳", dict:"カード辞典", tabLearn:"学ぶ", tabRead:"占う", tabRef:"調べる", tabLog:"記録", menu:"メニュー", lang:"言語",
 up:"正位置", rev:"逆位置", revShort:"（逆）", oneLine:"一言", close:"閉じる", list:"一覧", seeDict:"辞典で見る", mastered:"覚えた",
 stepEyebrow:"今のステップ",
 steps:[["1ヶ月目：大アルカナのキーワード（レベル1）","1日1枚引きで、キーワードを使って読んでみよう"],["1ヶ月目：キーワード3つと一言（レベル2）","大アルカナだけで3枚引きを始めよう"],["2〜3ヶ月目：絵柄のポイント（レベル3）","絵を見て連想してから読む練習をしよう。小アルカナは次の更新で追加予定"],["4ヶ月目：位置ごとの読み方（レベル4）","問いかけを変えた1日1枚引きと、二者択一に挑戦しよう"],["5〜6ヶ月目：深い読みとケルト十字","ストーリーでつなげる3枚引き、ヘキサグラム、ケルト十字を週1〜2回"]],
 lvNames:["キーワード1つ","キーワード3つ","絵柄","位置の読み方"], level:"レベル", cardsCount:n=>`${n} / 22枚`,
 levelNote:"各レベルで22枚を「覚えた」にしたら、次のレベルへ進みましょう。レベル5（深い読み）は「占う」で練習します。",
 flash:"フラッシュカード", quiz:"位置の練習問題", practiceKind:"練習の種類",
 deckDone:n=>`この回の${n}枚が終わりました`, deckDoneSub:"もう一度回すと、まだ覚えていないカードが出ます。", again1:"もう一周する",
 counter:(i,n)=>`${i} / ${n}枚目`, showRev:"逆位置も出す",
 prompts:["このカードのキーワードは？","キーワード3つと一言は？","絵の中のポイントと、その意味は？",p=>`「${p}」の位置に出たら、どう読む？`],
 showAnswer:"答えを見る", know:"覚えた", again:"もう一度", inPos:p=>`「${p}」の位置では：`, keywords:"キーワード",
 quizTitle:(c,p)=>`${c}が「${p}」の位置に出たら？`, hint:"ヒント", myReading:"自分の読み", quizPh:"例：〜という意味だから、〜と読める",
 seeExample:"解答例を見る", nextQ:"次の問題", example:"解答例", writeFirst:"先に自分の読みを書いてください。",
 copyAI:"AI用の文章をコピー", copied:"コピーしました。Claudeに貼り付けて送ってください。", openClaude:"Claudeを開く", copyFail:"コピーできませんでした。下の文章を選択してコピーしてください。",
 pasteAI:"AIの答えを貼り付け（記録に残せます）", pasteAIPh:"Claudeの答えをここに貼り付け",
 r1:"1. 占い方を選ぶ", r2:"2. 質問", r3:"3. カードを読む", r4:"4. 自分の読みを書く", spreadL:"スプレッド", guide:"目安",
 qType:"問いかけ", posMeaning:"位置の意味", timeV:"過去・現在・未来", advV:"状況・課題・アドバイス",
 qSuggest:{past:"これまでどうだった？",present:"今の私の状態は？",future:"今日はどんな日？",obstacle:"今日、気をつけることは？",advice:"今日、意識するといいことは？",outcome:"最終的にどうなる？"},
 qPhTwo:"例：AとB、どちらを選ぶといい？（A：〜、B：〜）", qPh:"例：今の仕事の流れは？",
 useRev:"逆位置を使う", draw:"カードを引く", newRead:"新しく占う", majorOnly:"今は大アルカナ22枚で占います。小アルカナは次の更新で追加予定です。",
 tapHint:"カードをタップすると、ヒントが見られます。", beforeDraw:"質問を決めたら「カードを引く」を押してください。",
 thinkFirst:"まず自分で考えてから、ヒントを1つずつ開いてみましょう。", pictureP:"絵柄のポイント", readInPos:p=>`「${p}」の位置で読むと`,
 noKey:d=>`この位置は「${d}」を表します。キーワードをその視点に当てはめて考えてみましょう。`,
 revNote:"逆位置なので、上の意味が弱まる・行き過ぎる・まだ準備中、といった方向で考えてみましょう。",
 nextHint:["キーワードを見る","絵柄のポイントを見る","この位置での読み方を見る"],
 mineLabel:"全体をつなげて、自分の言葉で", minePh:"1枚ずつの意味をつなげて、ひとつのストーリーにしてみましょう",
 save:"記録に保存する", update:"記録を更新する", savedMsg:"記録に保存しました。夜の振り返りは「記録」から書けます。",
 refCards:"カード", refSpreads:"スプレッド", refExamples:"リーディング例", search:"名前・キーワード・番号で探す", notFound:"見つかりませんでした。",
 minorSoon:"小アルカナ56枚は次の更新で追加予定です。", cardsN:n=>`${n}枚`, order:"読む順番：", theme:"テーマ",
 logWhere:"記録はこのブラウザに保存されています。パソコンとスマホで使うときは、書き出し・読み込みで移せます。",
 noLog:"まだ記録がありません", noLogSub:"「占う」でカードを引いて「記録に保存する」を押すと、ここに並びます。", tryRead:"占ってみる",
 noQ:"（質問なし）", blank:"（未記入）", aiAnswer:"AIの解釈", reflect:"振り返り（実際どうだった？）", reflectPh:"カードと重なる出来事や気持ちはあった？なければ「なかった」でOK",
 saveReflect:"振り返りを保存", savedShort:"保存しました",
 exportB:"書き出す", importB:"読み込む", backup:"バックアップ", imported:n=>`${n}件の記録を読み込みました。`, importErr:"ファイルを読み込めませんでした。このアプリで書き出したファイルを選んでください。",
 lv:["レベル1","レベル2：キーワード","レベル3：絵柄のポイント","レベル4：位置ごとの読み方（正位置）","レベル5：深い読み"],
 aiReading:(sp,q,lines,mine)=>`あなたはやさしく的確なタロットの先生です。タロットを勉強中の学習者のリーディングにコメントしてください。
デッキ：ライダー・ウェイト版（大アルカナのみ）
スプレッド：${sp}
質問：${q||'（質問なし）'}
カード：
${lines}
学習者の読み：${mine||'（まだ書いていない）'}

日本語で、全体で450字以内、次の見出しで書いてください。
【1枚ずつ】各カードを位置の意味に合わせて1文ずつ
【ストーリー】全体を2〜3文でつなげる
${mine?'【あなたの読みについて】よかった点を1つ、別の見方を1つ\n':''}未来を断定せず、行動のヒントとして書いてください。`,
 aiQuiz:(c,p,pq,a)=>`タロットを勉強中の学習者の答えに、やさしく短くコメントしてください。
カード：${c}（ライダー・ウェイト版、正位置）
位置：${p}（${pq}）
学習者の読み：${a}

日本語で200字以内。よかった点を1つ、さらに広げるヒントを1つ。`,
 lineFmt:(i,pos,name,rev)=>`${i}. ${pos}：${name}（${rev?'逆位置':'正位置'}）`
},
en:{
 appName:"Tarot Study Book", dict:"Card guide", tabLearn:"Learn", tabRead:"Read", tabRef:"Look up", tabLog:"Journal", menu:"Menu", lang:"Language",
 up:"Upright", rev:"Reversed", revShort:" (R)", oneLine:"In short", close:"Close", list:"All cards", seeDict:"Open in guide", mastered:"Learned",
 stepEyebrow:"Your next step",
 steps:[["Month 1: Major Arcana keywords (Level 1)","Do a one-card reading every day and use the keyword"],["Month 1: Three keywords and a short line (Level 2)","Start three-card readings with the Major Arcana only"],["Months 2–3: Picture details (Level 3)","Look at the picture and let ideas come before you read. Minor Arcana coming in the next update"],["Month 4: Reading by position (Level 4)","Try one-card readings with different questions, and the two-choice spread"],["Months 5–6: Deep reading and the Celtic Cross","Three cards as a story, the Hexagram, and the Celtic Cross once or twice a week"]],
 lvNames:["One keyword","Three keywords","Picture","Positions"], level:"Level ", cardsCount:n=>`${n} / 22 cards`,
 levelNote:"When all 22 cards are \"Learned\" in a level, move to the next one. Practise Level 5 (deep reading) in \"Read\".",
 flash:"Flashcards", quiz:"Position practice", practiceKind:"Type of practice",
 deckDone:n=>`You finished these ${n} cards`, deckDoneSub:"Go again to see the cards you have not learned yet.", again1:"Go again",
 counter:(i,n)=>`Card ${i} of ${n}`, showRev:"Include reversed",
 prompts:["What is the keyword for this card?","What are the three keywords and the short line?","What details are in the picture, and what do they mean?",p=>`How do you read it in the "${p}" position?`],
 showAnswer:"Show answer", know:"Learned", again:"Again", inPos:p=>`In the "${p}" position: `, keywords:"Keywords",
 quizTitle:(c,p)=>`${c} in the "${p}" position?`, hint:"Hint", myReading:"My reading", quizPh:"Example: it means …, so I read it as …",
 seeExample:"Show example answer", nextQ:"Next question", example:"Example answer", writeFirst:"Write your own reading first.",
 copyAI:"Copy text for AI", copied:"Copied. Paste it into Claude and send it.", openClaude:"Open Claude", copyFail:"Could not copy. Select the text below and copy it.",
 pasteAI:"Paste the AI answer (to keep it in your journal)", pasteAIPh:"Paste Claude's answer here",
 r1:"1. Choose a spread", r2:"2. Question", r3:"3. Read the cards", r4:"4. Write your reading", spreadL:"Spread", guide:"suggested",
 qType:"Question type", posMeaning:"Position meanings", timeV:"Past · Present · Future", advV:"Situation · Challenge · Advice",
 qSuggest:{past:"How was it until now?",present:"How am I now?",future:"What kind of day will it be?",obstacle:"What should I be careful about today?",advice:"What should I focus on today?",outcome:"How will it end?"},
 qPhTwo:"Example: A or B, which is better? (A: …, B: …)", qPh:"Example: How is my work going?",
 useRev:"Use reversed cards", draw:"Draw cards", newRead:"New reading", majorOnly:"For now you read with the 22 Major Arcana. Minor Arcana coming in the next update.",
 tapHint:"Tap a card to see hints.", beforeDraw:"Choose your question, then press \"Draw cards\".",
 thinkFirst:"Think for yourself first, then open the hints one by one.", pictureP:"Picture details", readInPos:p=>`Reading in the "${p}" position`,
 noKey:d=>`This position means "${d}". Use the keywords from this point of view.`,
 revNote:"It is reversed: think of the meaning as weaker, too strong, or not ready yet.",
 nextHint:["Show keywords","Show picture details","Show reading for this position"],
 mineLabel:"Join everything in your own words", minePh:"Connect the meaning of each card into one story",
 save:"Save to journal", update:"Update journal", savedMsg:"Saved. You can write your evening review in \"Journal\".",
 refCards:"Cards", refSpreads:"Spreads", refExamples:"Example readings", search:"Search by name, keyword or number", notFound:"Nothing found.",
 minorSoon:"The 56 Minor Arcana cards are coming in the next update.", cardsN:n=>`${n} card${n>1?'s':''}`, order:"Reading order: ", theme:"Theme",
 logWhere:"Your journal is saved in this browser. To use it on your computer and phone, export and import it.",
 noLog:"No entries yet", noLogSub:"Draw cards in \"Read\" and press \"Save to journal\". Your readings will appear here.", tryRead:"Do a reading",
 noQ:"(no question)", blank:"(empty)", aiAnswer:"AI reading", reflect:"Review (what really happened?)", reflectPh:"Did anything match the card? If not, just write \"nothing\"",
 saveReflect:"Save review", savedShort:"Saved",
 exportB:"Export", importB:"Import", backup:"Backup", imported:n=>`Imported ${n} entries.`, importErr:"Could not read the file. Choose a file exported from this app.",
 lv:["Level 1","Level 2: Keywords","Level 3: Picture details","Level 4: Reading by position (upright)","Level 5: Deep reading"],
 aiReading:(sp,q,lines,mine)=>`You are a kind and clear tarot teacher. Please comment on the reading of a student who is learning tarot.
Deck: Rider-Waite (Major Arcana only)
Spread: ${sp}
Question: ${q||'(no question)'}
Cards:
${lines}
Student's reading: ${mine||'(not written yet)'}

Answer in simple English (CEFR B1 level), in under 250 words, with these headings:
[Card by card] one sentence for each card, using its position
[Story] join everything in 2–3 sentences
${mine?'[About your reading] one good point and one other way to see it\n':''}Do not predict the future as certain. Give ideas for action.`,
 aiQuiz:(c,p,pq,a)=>`Please give short, kind feedback to a student who is learning tarot.
Card: ${c} (Rider-Waite, upright)
Position: ${p} (${pq})
Student's reading: ${a}

Answer in simple English (CEFR B1 level), under 100 words. One good point and one hint to go further.`,
 lineFmt:(i,pos,name,rev)=>`${i}. ${pos}: ${name} (${rev?'reversed':'upright'})`
},
fr:{
 appName:"Carnet de Tarot", dict:"Guide des cartes", tabLearn:"Apprendre", tabRead:"Tirer", tabRef:"Chercher", tabLog:"Journal", menu:"Menu", lang:"Langue",
 up:"À l'endroit", rev:"À l'envers", revShort:" (env.)", oneLine:"En bref", close:"Fermer", list:"Toutes les cartes", seeDict:"Voir dans le guide", mastered:"Appris",
 stepEyebrow:"Votre prochaine étape",
 steps:[["Mois 1 : mots-clés des arcanes majeurs (niveau 1)","Faites un tirage d'une carte chaque jour avec le mot-clé"],["Mois 1 : trois mots-clés et une phrase (niveau 2)","Commencez les tirages à trois cartes avec les arcanes majeurs"],["Mois 2–3 : détails de l'image (niveau 3)","Regardez l'image et laissez venir les idées avant de lire. Arcanes mineurs dans la prochaine mise à jour"],["Mois 4 : lecture selon la position (niveau 4)","Essayez des tirages d'une carte avec différentes questions, et le tirage à deux choix"],["Mois 5–6 : lecture profonde et croix celtique","Trois cartes comme une histoire, l'hexagramme et la croix celtique une ou deux fois par semaine"]],
 lvNames:["Un mot-clé","Trois mots-clés","Image","Positions"], level:"Niveau ", cardsCount:n=>`${n} / 22 cartes`,
 levelNote:"Quand les 22 cartes sont « apprises » dans un niveau, passez au suivant. Le niveau 5 (lecture profonde) se pratique dans « Tirer ».",
 flash:"Cartes mémoire", quiz:"Exercice des positions", practiceKind:"Type d'exercice",
 deckDone:n=>`Vous avez fini ces ${n} cartes`, deckDoneSub:"Recommencez pour revoir les cartes pas encore apprises.", again1:"Recommencer",
 counter:(i,n)=>`Carte ${i} sur ${n}`, showRev:"Inclure à l'envers",
 prompts:["Quel est le mot-clé de cette carte ?","Quels sont les trois mots-clés et la phrase ?","Quels détails voyez-vous dans l'image, et que veulent-ils dire ?",p=>`Comment la lire en position « ${p} » ?`],
 showAnswer:"Voir la réponse", know:"Appris", again:"Encore", inPos:p=>`En position « ${p} » : `, keywords:"Mots-clés",
 quizTitle:(c,p)=>`${c} en position « ${p} » ?`, hint:"Indice", myReading:"Ma lecture", quizPh:"Exemple : elle veut dire …, donc je lis …",
 seeExample:"Voir un exemple de réponse", nextQ:"Question suivante", example:"Exemple de réponse", writeFirst:"Écrivez d'abord votre propre lecture.",
 copyAI:"Copier le texte pour l'IA", copied:"Copié. Collez-le dans Claude et envoyez-le.", openClaude:"Ouvrir Claude", copyFail:"Impossible de copier. Sélectionnez le texte ci-dessous et copiez-le.",
 pasteAI:"Collez la réponse de l'IA (pour la garder dans le journal)", pasteAIPh:"Collez ici la réponse de Claude",
 r1:"1. Choisir un tirage", r2:"2. Question", r3:"3. Lire les cartes", r4:"4. Écrire votre lecture", spreadL:"Tirage", guide:"conseillé",
 qType:"Type de question", posMeaning:"Sens des positions", timeV:"Passé · Présent · Futur", advV:"Situation · Obstacle · Conseil",
 qSuggest:{past:"Comment c'était jusqu'à maintenant ?",present:"Comment je vais en ce moment ?",future:"Quel genre de journée m'attend ?",obstacle:"À quoi faire attention aujourd'hui ?",advice:"Sur quoi me concentrer aujourd'hui ?",outcome:"Comment cela va-t-il finir ?"},
 qPhTwo:"Exemple : A ou B, lequel choisir ? (A : …, B : …)", qPh:"Exemple : Comment évolue mon travail ?",
 useRev:"Utiliser les cartes à l'envers", draw:"Tirer les cartes", newRead:"Nouveau tirage", majorOnly:"Pour l'instant, vous tirez avec les 22 arcanes majeurs. Les arcanes mineurs arrivent dans la prochaine mise à jour.",
 tapHint:"Touchez une carte pour voir les indices.", beforeDraw:"Choisissez votre question, puis appuyez sur « Tirer les cartes ».",
 thinkFirst:"Réfléchissez d'abord seul, puis ouvrez les indices un par un.", pictureP:"Détails de l'image", readInPos:p=>`Lecture en position « ${p} »`,
 noKey:d=>`Cette position veut dire « ${d} ». Utilisez les mots-clés de ce point de vue.`,
 revNote:"La carte est à l'envers : pensez à un sens plus faible, trop fort, ou pas encore prêt.",
 nextHint:["Voir les mots-clés","Voir les détails de l'image","Voir la lecture pour cette position"],
 mineLabel:"Reliez tout avec vos propres mots", minePh:"Reliez le sens de chaque carte en une seule histoire",
 save:"Enregistrer dans le journal", update:"Mettre à jour le journal", savedMsg:"Enregistré. Vous pourrez écrire votre bilan du soir dans « Journal ».",
 refCards:"Cartes", refSpreads:"Tirages", refExamples:"Exemples de lecture", search:"Chercher par nom, mot-clé ou numéro", notFound:"Aucun résultat.",
 minorSoon:"Les 56 arcanes mineurs arrivent dans la prochaine mise à jour.", cardsN:n=>`${n} carte${n>1?'s':''}`, order:"Ordre de lecture : ", theme:"Thème",
 logWhere:"Votre journal est enregistré dans ce navigateur. Pour l'utiliser sur ordinateur et téléphone, exportez-le puis importez-le.",
 noLog:"Pas encore d'entrées", noLogSub:"Tirez des cartes dans « Tirer » et appuyez sur « Enregistrer dans le journal ». Vos tirages apparaîtront ici.", tryRead:"Faire un tirage",
 noQ:"(pas de question)", blank:"(vide)", aiAnswer:"Lecture de l'IA", reflect:"Bilan (que s'est-il vraiment passé ?)", reflectPh:"Est-ce que quelque chose correspondait à la carte ? Sinon, écrivez simplement « rien »",
 saveReflect:"Enregistrer le bilan", savedShort:"Enregistré",
 exportB:"Exporter", importB:"Importer", backup:"Sauvegarde", imported:n=>`${n} entrées importées.`, importErr:"Impossible de lire le fichier. Choisissez un fichier exporté depuis cette application.",
 lv:["Niveau 1","Niveau 2 : mots-clés","Niveau 3 : détails de l'image","Niveau 4 : lecture selon la position (à l'endroit)","Niveau 5 : lecture profonde"],
 aiReading:(sp,q,lines,mine)=>`Vous êtes un professeur de tarot gentil et clair. Commentez le tirage d'un élève qui apprend le tarot.
Jeu : Rider-Waite (arcanes majeurs seulement)
Tirage : ${sp}
Question : ${q||'(pas de question)'}
Cartes :
${lines}
Lecture de l'élève : ${mine||'(pas encore écrite)'}

Répondez en français simple (niveau B1 du CECRL), en moins de 250 mots, avec ces titres :
[Carte par carte] une phrase pour chaque carte, selon sa position
[Histoire] reliez le tout en 2 ou 3 phrases
${mine?'[Sur votre lecture] un point positif et une autre façon de voir\n':''}Ne présentez pas le futur comme certain. Donnez des idées d'action.`,
 aiQuiz:(c,p,pq,a)=>`Donnez un retour court et gentil à un élève qui apprend le tarot.
Carte : ${c} (Rider-Waite, à l'endroit)
Position : ${p} (${pq})
Lecture de l'élève : ${a}

Répondez en français simple (niveau B1 du CECRL), en moins de 100 mots. Un point positif et une piste pour aller plus loin.`,
 lineFmt:(i,pos,name,rev)=>`${i}. ${pos} : ${name} (${rev?"à l'envers":"à l'endroit"})`
}
};
