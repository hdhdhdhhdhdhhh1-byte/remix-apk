import { getDatabase } from "./Database";

const STOP_WORDS = new Set([
"ما","هي","عن","ماذا","هل","من","في","الى",
"على","هذا","هذه","ذلك","كيف","لماذا",
"كم","كان","كانت","هو","هي"
]);


function tokenize(text:string){

return text
.toLowerCase()
.replace(/[؟?!.,،]/g," ")
.replace(/[أإآ]/g,"ا")
.replace(/ة/g,"ه")
.split(/\s+/)
.map(w=>w.trim())
.filter(w =>
w.length>2 &&
!STOP_WORDS.has(w)
);

}



function score(query:string,item:any){

const q = tokenize(query);


const title = tokenize(item.title||"");
const content = tokenize(item.content||"");
const keywords = tokenize(item.keywords||"");


let score=0;


for(const word of q){


if(title.includes(word))
score+=20;


if(keywords.includes(word))
score+=10;


if(content.includes(word))
score+=3;


}



const total=[
...title,
...keywords,
...content
];


const matched=q.filter(x=>total.includes(x));


score += matched.length*5;


// نسبة التشابه

score += 
(matched.length / Math.max(q.length,1))*20;


return score;

}



export class KnowledgeEngine {


async search(query:string){


const db=await getDatabase();


const stmt=db.prepare(`
SELECT *
FROM knowledge
`);


let results:any[]=[];


while(stmt.step()){

const row=stmt.getAsObject();

results.push({
...row,
score:score(query,row)
});

}


stmt.free();


return results
.filter(x=>x.score>0)
.sort(
(a,b)=>b.score-a.score
);


}



async ask(query:string){


const results=await this.search(query);


if(!results.length)
return null;


const best=results[0];


console.log(
"KNOWLEDGE BEST:",
best.title,
"SCORE:",
best.score
);



if(best.score<8)
return null;


return best.content;


}



async answer(query:string){

return await this.ask(query);

}


}
