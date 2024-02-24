const food = {
    informations: {},
    scores: {}
}

//Resgate das informações básicas da comida, ex: nome, código de barras, quantidade e etc...
food.informations['title'] = document.querySelector('.title-1').innerText
food.informations['barcode'] = document.querySelector('#barcode').innerText

const informationElements = [...document.querySelectorAll('.field_value')]
informationElements.forEach(info => {
    const typeInfo = info.id.match(/_(.+)_/)?.[1]
    const InfoText = info.innerText

    if(InfoText){
        food.informations[typeInfo] = InfoText
    }else{
        food.informations[typeInfo] = 'Not available'
    }
})

//Resgate dos Scores(Nutri-Score, NOVA, Eco-Score)
const scoreNamesForScrapping = ['nutriscore', 'nova', 'ecoscore']
scoreNamesForScrapping.forEach(scoreName => {
    const element = document.querySelector(`[href="#panel_${scoreName}"]`);
    const scoreValue = element.querySelector('h4').className.match(/_(.+)_/)?.[1].includes('unknown')?'Desconhecido':element.querySelector('h4').innerText
    const score = {
        score: scoreValue,
        title: element.querySelector('span').innerText
    }
    food.scores[scoreName] = score
});

console.log(food)