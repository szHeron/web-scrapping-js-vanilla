const food = {}

function Start(){
    food.informations = GetBasicInformations()
    food.scores = GetScore()
    food.ingredients = GetIngredients()
    food.nutrition = GetNutrition()
    console.log(food)
}

function GetBasicInformations(){
    const informations = {}
    const title = document.querySelector('.title-1')
    const barcode = document.querySelector('#barcode')
    const image = document.querySelector('#og_image')
    const restOfinformationNamesForScrapping = ['brands', 'countries', 'quantity', 'categories']
    const informationElements = [...document.querySelectorAll('.field_value')].map(item => {
        return {
            informationName: item.id.match(/_(.+)_/)?.[1],
            informationText: item.innerText
        }
    })

    restOfinformationNamesForScrapping.forEach(name => {
        const info = informationElements.find(item => item.informationName === name)
        informations[name] = info?info.informationText:'Unknown'
    })

    informations.title = title?title.innerText:'Unknown'
    informations.barcode = barcode?barcode.innerText:'Unknown'
    informations.image = image?image.src:'Unknown'

    return informations
}

function GetScore(){
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

    return ingredients
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

function GetNutrition(){
    const nutrition = {}
    const nutritionValuesElement = document.querySelector('#panel_nutrient_levels_content')
    const servingSize = document.querySelector('#panel_serving_size_content')

    if(nutritionValuesElement){
        nutrition.nutritionValues = [...nutritionValuesElement.querySelectorAll('h4')].map(item => item.innerText)
    }else{
        nutrition.nutritionValues = 'Unknown'
    }

    nutrition.nutritionData = GetNutritionDataTable()
    nutrition.servingSize = servingSize?servingSize.innerText:'Unknown'

    return nutrition
}

function GetNutritionDataTable(){
    const nutritionData = {}
    const tableBodyElement = [...document.querySelector('[aria-label="Dados nutricionais"]').querySelectorAll('tr')]

    tableBodyElement.slice(1,tableBodyElement.length).forEach(tr => {
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

Start()