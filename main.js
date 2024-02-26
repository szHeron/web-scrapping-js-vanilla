const food = {}

function start(){
    food.informations = getBasicInformations()
    food.scores = getScore()
    food.ingredients = getIngredients()
    food.nutrition = getNutrition()
    console.log(food)
}

function getBasicInformations(){
    const titleElement = document.querySelector('.title-1')
    const barcodeElement = document.querySelector('#barcode')
    const imageElement = document.querySelector('#og_image')
    const informationElements = [...document.querySelectorAll('.field_value')]
    const informationsMap = informationElements.map(item => {
        return {
            informationName: item.id.match(/_(.+)_/)?.[1],
            informationText: item.innerText
        }
    })
    const restOfinformationNames = ['brands', 'countries', 'quantity', 'categories']
    const restOfInformations = {}

    restOfinformationNames.forEach(name => {
        const info = informationsMap.find(item => item.informationName === name)
        restOfInformations[name] = info?info.informationText:'Unknown'
    })

    return {
        title: titleElement?titleElement.innerText:'Unknown',
        barcode: barcodeElement?barcodeElement.innerText:'Unknown',
        image: imageElement?imageElement.src:'Unknown',
        ...restOfInformations
    }
}

function getScore(){
    const scores = {}
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

    return scores
}


function getIngredients(){
    const ingredients = {
        hasPalmOil: 'Unknown',
        isVegan: 'Unknown',
        isVegetarian: 'Unknown',
        list: ''
    }
    const listOfAnalyzedIngredients = [...document.querySelectorAll('a[href*="#panel_ingredients_analysis"]')].map(item => item.querySelector('h4').innerText)

    if(listOfAnalyzedIngredients.length > 0){
        listOfAnalyzedIngredients.slice(0,3).forEach(item => {
            item = item.toLocaleUpperCase()
            if(item.includes('VEGANO')){
                ingredients.isVegan = analyzeIngredient(item)
            }else if(item.includes('VEGETARIANO')){
                ingredients.isVegetarian = analyzeIngredient(item)
            }else{
                ingredients.hasPalmOil = analyzeIngredient(item)
            }
        })

        ingredients.list = document.querySelector('#panel_ingredients_content').querySelector('.panel_text').innerText
    }

    return ingredients
}

function analyzeIngredient(ingredient){
    if(['NÃO', 'POSSIVELMENTE', 'PODE'].some(word => ingredient.includes(word))){
        return false
    }else if(['DESCONHECIDO', 'DESCONHECE-SE'].some(word => ingredient.includes(word))){
        return 'Unknown'
    }else{
        return true
    }
}

function getNutrition(){
    const nutrition = {}
    const nutritionValuesElement = document.querySelector('#panel_nutrient_levels_content')
    const servingSizeElement = document.querySelector('#panel_serving_size_content')

    if(nutritionValuesElement){
        nutrition.nutritionValues = [...nutritionValuesElement.querySelectorAll('h4')].map(item => item.innerText)
    }else{
        nutrition.nutritionValues = 'Unknown'
    }

    nutrition.nutritionData = getNutritionDataTable()
    nutrition.servingSize = servingSizeElement?servingSizeElement.innerText:'Unknown'

    return nutrition
}

function getNutritionDataTable(){
    const nutritionData = {}
    const tableBodyElement = [...document.querySelector('[aria-label="Dados nutricionais"]').querySelectorAll('tr')]

    tableBodyElement.slice(1).forEach(tr => {
        const data = [...tr.querySelectorAll('td')].map(item => item.innerText)
        const per100g = data[1].length > 1?data[1].replace('\n', ''):'Unknown'
        const perServing = data[2].length > 1?data[2].replace('\n', ''):'Unknown'

        nutritionData[data[0]] = {
            per100g,
            perServing
        }
    })

    return nutritionData
}

start()