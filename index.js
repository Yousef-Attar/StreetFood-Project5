import { menuArray} from "/data.js"

const menu=document.getElementById("menu");
const addBtn = document.getElementById("add-btn")
const order = document.getElementById("order")
const orderFlex=document.getElementById("order-flex")
const overlay = document.getElementById('overlay')

let orderArray = []
let inputValueArr = []
let innerHtml = menuArray.map((item) => {
    return `
    <div class="item-flex">
        <p class="item-emj">${item.emoji}</p>
        <div class="item-info">
            <h2>${item.name}</h2>
            <p class='ingredient'>${item.ingredients.join(" , ")}</p>
            <p>$${item.price}</p>
        </div>
        <button class="add-btn" id="${item.id}" data-add="addItem">+</button>
    </div>`
}).join('')
menu.innerHTML = innerHtml

document.addEventListener('click' , function(e){
    let id = 0
    if(e.target.dataset.add){
        id = parseInt(e.target.id)
        if(getIsOrdred(id) === false){
        let orderObject = {name :getName(id),
                           price :getPrice(id),
                           uid : id
                           }
        setIsOrdred(id , true)
        orderArray.push(orderObject)
        order.style.display = 'inline'
        getOrder(id)

        changeInputValue(id, false, false , true)
        totalPrice(false , true , id)
        inputValueArr[id] = 1
   }}
   else if(e.target.dataset.delete){
        removeClick(e.target.dataset.delete)
        if (orderArray.length === 0)
            order.style.display = 'none' 
        id = parseInt(e.target.id)
        setIsOrdred(id, false)
        getOrder(id)
        inputValueArr[id] = 1 
        changeInputValue(id, false, true , false) 
        totalPrice(true, false , id)
        isRemoved[id] = true
    }
   else if (e.target.dataset.increasing){
        id = parseInt(e.target.dataset.increasing)
        changeInputValue(id , true , false , false) 
    }
    else if (e.target.dataset.decreasing){
        id = parseInt(e.target.dataset.decreasing)
        changeInputValue(id, false, false , false) 
    }
    else if (e.target.dataset.confirm){
        overlay.style.display = 'flex';
    }
    else if(e.target.dataset.exit){
        console.log('done')
        e.preventDefault()
        overlay.style.display = 'none'
    }
    else if(e.target.dataset.pay){
        const inputName = document.getElementById('input-name').value.trim()
        const inputCard = document.getElementById('input-card').value.replace(/\s+/g, '')
        const inputCCV = document.getElementById('input-ccv').value.trim()
        e.preventDefault()
        if(inputName === '' || inputCCV === '' || inputCard === '')
            alert('Please fill in all fields.')
        else if (!/^\d{16}$/.test(inputCard))
            alert("Please enter a valid 16-digit card number.")     
        else if (!/^\d{3}$/.test(inputCCV)) 
            alert("Please enter a valid 3-digit CCV.")      
        else{
        document.getElementById('loading').style.display = 'flex'

        setTimeout(function () {
            document.getElementById('loading').style.display = 'none'
            document.getElementById('order').innerHTML = `
            <h1 class='thanks-statement'>
            Thanks ${inputName.split(' ')[0]}, your order on it's way
            <h1> `
          }, 4000)
        }
        }
})

function getName(id){
    let name = ``
    menuArray.forEach((item) => {
        if (item.id === id)
        name = item.name
    })
    return name
}
function getPrice(id){
    let price = 0 
    for(let i=0 ; i<menuArray.length ; i++)
        if(menuArray[i].id === id){
            price = menuArray[i].price
            break
        }
    return price
}
function getIsOrdred(id){
    let isOrdred = false
     menuArray.forEach((item) => {
        if (item.id === id)
        isOrdred = item.isOrdred
    })
    return isOrdred
}
function setIsOrdred(id , isOrdred){
    menuArray.forEach((item) => {
        if (item.id === id)
        item.isOrdred = isOrdred
    })
}
function getOrder(id){  
   let innerHtml2 = ``
    orderArray.forEach((order) => {
        {
       innerHtml2 +=
        (`
            <div class="food-flex">
                <h2>${order.name}</h2>
                <button  id="${order.uid}" class="delete-btn" data-delete=${order.name}>remove</button>
                <div class='quantity-flex'>
                    <button id='decreasing-${order.uid}' data-decreasing= ${order.uid }>-</button>
                    <input
                    id="quantity-${order.uid}"
                    class="quantity"
                    value = 1 
                    type="number"
                    min='1' max='100'
                    readonly
                    >
                    <button id='increasing-${order.uid}' data-increasing = ${order.uid} >+</button>
                 </div>
                <p class="auto-price" id=price-${order.uid}> ${order.price} </p>
            </div>
       `)
    }
    }) 
   orderFlex.innerHTML = innerHtml2
}
function removeClick(name){
    for(let i=0 ; i< orderArray.length; i++)
        if(orderArray[i].name === name){
            orderArray.splice(i,1)
            break
        }
}
function changeInputValue(id , isIncrease , isRemove , isAdd){
    let inputValue = document.getElementById(`quantity-${id}`)
    if(isIncrease){
        inputValue.value = parseInt(inputValue.value) + 1
        inputValueArr[id] = Number(inputValue.value)   // to avoid another function getValueInput()
        setPrice(id , inputValue.value , getPrice(id) )
        totalPrice(false , false , id)
    }
    else if(!isIncrease && !isRemove && !isAdd && inputValue.value > 1 ) {//decreasing
    inputValue.value = parseInt(inputValue.value) - 1  
    inputValueArr[id] = Number(inputValue.value)   // to avoid another function getValueInput()
    setPrice(id , inputValue.value , getPrice(id))
    totalPrice(false , false , id)
}
    else if(isRemove){
        for(let i=0 ; i<inputValueArr.length ; i++)
            if(getIsOrdred(i)){
                document.getElementById(`quantity-${i}`).value = inputValueArr[i]
                setPrice( i , document.getElementById(`quantity-${i}`).value , getPrice(i))
    }
    totalPrice(true , false , id)
    }
    else if(isAdd){
        for(let i=0 ; i<inputValueArr.length ; i++)
            if(getIsOrdred(i)){
                document.getElementById(`quantity-${i}`).value = inputValueArr[i]
                setPrice( i , document.getElementById(`quantity-${i}`).value , getPrice(i))
            }}
}
function setPrice(id , qts , price){
        const priceQts = Number(price) * Number(qts)
        document.getElementById(`price-${id}`).innerHTML
         = `$${priceQts}`
}
function totalPrice(isRemove , isAdd , id){
    let totalPrice = 0
    if(isAdd){
        totalPrice = getPrice(id)
        document.getElementById("total-price").innerHTML
        = Number(document.getElementById("total-price").innerHTML) + totalPrice
    }
   else if(isRemove){
        for(let i=0 ; i<inputValueArr.length ; i++){
            if(i != id && getIsOrdred(i))
             totalPrice += getPrice(i) * inputValueArr[i]
        }
        document.getElementById("total-price").innerHTML = totalPrice
        }
    else{
    for(let i=0 ; i<inputValueArr.length ; i++){
        if(getIsOrdred(i))
        totalPrice += getPrice(i) * inputValueArr[i]
    }
    document.getElementById("total-price").innerHTML = totalPrice
}
}