const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
//seleciona a lista
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")
//Capturar evento de input
amount.oninput = () => { /* esse evento observa toda vez que algo entrar no input*/
  let value = amount.value.replace(/\D/g, "")/* aqui vamos receber o valor do input somente em números, pelo comando (/\D/g).*/

  //transformar o valor em centavos
  value = Number(value) / 100

  //atualiza o valor do input
  amount.value = formatCurrencyBRL(value)
}

//formatando a moeda

function formatCurrencyBRL(value){
  //formata no valor brl
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency : "BRL",
  })
  //retorna ja formatado
  return value
}

//captura o evento de submit dos valores no forms
form.onsubmit = (event) => {
 event.preventDefault() //impede a página de recarregar

 //cria objto com detalhe das despesas
 const newExpense = {
  id: new Date().getTime(), //data e hora da despesa
  expense: expense.value, //valor da despesa
  category_id: category.value, //valor da categoria
  category_name: category.options[category.selectedIndex].text,//nomes das categorias
  amount: amount.value,//valor da despesa
  create_at: new Date(), //vai criar a data da compra
 }
 //chama a função de adicionar item a lista
 expenseAdd(newExpense)
}

//função pra adicionar nova despesa na lista

function expenseAdd(newExpense) {
  try{ // cria o elemento li pra adicionar na lista
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    //cria o iconi da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)


    //criando informação da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    //criar nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense// o expenseName vai receber o nome que a nova despesa recebeu ao entrar na lista de despesa.

    //cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    //cria o span pro valor
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    //criar botão de remover

    const removerIcon = document.createElement("img")
    removerIcon.classList.add("remove-icon")
    removerIcon.setAttribute("src", "img/remove.svg")
    removerIcon.setAttribute("alt", "remover")

    
    //adiciona o nome e categoria dentro da expenseinfo (div das informações)
    expenseInfo.append(expenseName, expenseCategory)

    //adiciona informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removerIcon)

    //adiciona o item na lista
    expenseList.append(expenseItem)

    //limpar o form pra novo item
    formClear()
    //atualiza o total
    updateTotals()

  }catch (error) {
    alert("Não foi possivel atualizar a lista de despesas.")
    console.log(error)
  }
}

//função pra atualizar os totais
function updateTotals() {
  try {
   //Recupera todos os itens (li) da lista (ul)
   const items = expenseList.children

    // Atualiza a quantidade de itens da lista
   expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`


   //variavel pra incrementar o total
   let total = 0
   //percorre cada li da lista e acrescenta a objeto total
   for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")
    
    //removando caracteres não numéricos
    let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

    //converter o valor para float, onde poderemos fazer equações
    value = parseFloat(value)

    //verifica se um número é válido
    if (isNaN(value)) {
      return alert("Não foi possível calcular o total. O valor não parece ser um número.")
    }

    //incrementar o valor total
    total += Number(value)
   }
   
   //criar span pra adicionar o r$ formatado
   const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"


   //formata o valor e remove o R$ exibido pela small com estilo costumizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")
   //limpa o conteúdo do elemento
   expensesTotal.innerHTML = ""

   //adiciona o simbolo da moeda e o valor
   expensesTotal.append(symbolBRL, total)
  } catch (error) {
    alert("Não foi possível atualizar os totais.")
    console.log(error)
  }
}

//evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function (event) {
  //verifica se o elemento clicado é o iconi de remover
  if (event.target.classList.contains("remove-icon")) {
    //obter a li pai do elemento clicado
    const item = event.target.closest(".expense")
    //remove o item da lista
    item.remove()
  }
  //atualiza os totais
  updateTotals()
})

function formClear() {
  //limpa os inputs
  expense.value = ""
  category.value = ""
  amount.value = ""
 //coloca o foco no amount
  expense.focus()
}