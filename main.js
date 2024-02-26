const food = {}

function Start(){
    GetBasicInformations()
    GetScore()
    GetIngredients()
    console.log(food)
}

function GetBasicInformations(){
    const informations = {
        title: '',
        barcode: '',
        brands: '',
        quantity: '',
        countries: '',
        packaging: ''
    }
    informations.title = document.querySelector('.title-1').innerText
    informations.barcode = document.querySelector('#barcode').innerText
    
    const informationElements = [...document.querySelectorAll('.field_value')].map(item => {
        return {
            information: item.id.match(/_(.+)_/)?.[1],
            informationText: item.innerText
        }
    })
    const informationNamesForScrapping = ['brands', 'countries', 'quantity', 'categories', 'packaging']
    informationNamesForScrapping.forEach(infoName => {
        const info = informationElements.find(item => item.information === infoName)
        informations[infoName] = info?info.informationText:'Unknown'
    })
    food.informations = informations
}

function GetScore(){
    const scores = {
        nutriscore: '',
        nova: '',
        ecoscore: ''
    }
    const scoreNamesForScrapping = ['nutriscore', 'nova', 'ecoscore']
    scoreNamesForScrapping.forEach(scoreName => {
        const element = document.querySelector(`[href="#panel_${scoreName}"]`);
        const scoreValue = element.querySelector('h4').className.match(/_(.+)_/)?.[1].includes('unknown')?'Unknown':element.querySelector('h4').innerText
        const scoreTitle = element.querySelector('span').innerText
        const score = {
            score: scoreValue,
            title: scoreTitle
        }
        scores[scoreName] = score
    });
    food.scores = scores
}


function GetIngredients(){
    const ingredients = {
        hasPalmOil: 'Unknown',
        isVegan: 'Unknown',
        isVegetarian: 'Unknown',
        list: ''
    }
    const ingredientAnalysisElements = [...document.querySelectorAll('a[href*="#panel_ingredients_analysis"]')].map(item => item.querySelector('h4').innerText)
    if(ingredientAnalysisElements.length > 0){
        ingredientAnalysisElements.slice(0,3).forEach(item => {
            item = item.toLocaleUpperCase()
            if(item.includes('VEGANO')){
                ingredients.isVegan = IngredientAnalysis(item)
            }else if(item.includes('VEGETARIANO')){
                ingredients.isVegetarian = IngredientAnalysis(item)
            }else{
                ingredients.hasPalmOil = IngredientAnalysis(item)
            }
        })
        ingredients.list = document.querySelector('#panel_ingredients_content').querySelector('.panel_text').innerText
    }
    food.ingredients = ingredients
}

function IngredientAnalysis(ingredient){
    if(['NÃO', 'POSSIVELMENTE', 'PODE'].some(word => ingredient.includes(word))){
        return false
    }else if(['DESCONHECIDO', 'DESCONHECE-SE'].some(word => ingredient.includes(word))){
        return 'Unknown'
    }else{
        return true
    }
}

Start()