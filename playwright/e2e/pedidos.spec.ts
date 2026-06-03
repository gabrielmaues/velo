import { test, expect } from '@playwright/test'



import { generateOrderCode } from '../support/helpers'


import { LandingPage } from '../support/pages/LandingPage'
import { NavBar } from '../support/components/NavBar'
import { OrderLockupPage, type OrderDetails } from '../support/pages/OrderLockupPage'



/// AAA - Arrange, Act, Assert



test.describe('Consulta de Pedido', () => {

  let orderLockupPage: OrderLockupPage


  test.beforeEach(async ({ page }) => {

    // Arrange
    await new LandingPage(page).goto()
    await new NavBar(page).orderLockupLink()

    orderLockupPage = new OrderLockupPage(page)
    await new OrderLockupPage(page).validatePageLoaded()

  })



  test('deve consultar um pedido aprovado', async ({ page }) => {



    // Test Data

    const order: OrderDetails = {

      number: 'VLO-BCRGD4',

      status: 'APROVADO',

      color: 'Glacier Blue',

      wheels: 'sport Wheels',

      customer: {

        name: 'Gabriel Maues',

        email: 'maumau@velo.dev'

      },

      payment: 'À Vista'

    }



    // Act  

    await orderLockupPage.searchOrder(order.number)



    // Assert

    await orderLockupPage.validateOrderDetails(order)

    await orderLockupPage.validateStatusBadge(order.status)



  })



  test('deve consultar um pedido reprovado', async ({ page }) => {



    // Test Data

    const order: OrderDetails = {

      number: 'VLO-X186FV',

      status: 'REPROVADO',

      color: 'Midnight Black',

      wheels: 'sport Wheels',

      customer: {

        name: 'Steve Jobs',

        email: 'jobs@apple.com'

      },

      payment: 'À Vista'

    }



    // Act  

    await orderLockupPage.searchOrder(order.number)



    // Assert

    await orderLockupPage.validateOrderDetails(order)

    await orderLockupPage.validateStatusBadge(order.status)

  })



  test('deve consultar um pedido em analise', async ({ page }) => {



    // Test Data

    const order: OrderDetails = {

      number: 'VLO-A6U0IQ',

      status: 'EM_ANALISE',

      color: 'Glacier Blue',

      wheels: 'aero Wheels',

      customer: {

        name: 'Joao da Silva',

        email: 'joao@velo.dev'

      },

      payment: 'À Vista'

    }



    // Act  

    await orderLockupPage.searchOrder(order.number)



    // Assert

    await orderLockupPage.validateOrderDetails(order)

    await orderLockupPage.validateStatusBadge(order.status)

  })



  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {



    const order = generateOrderCode()



    const orderLockupPage = new OrderLockupPage(page)

    await orderLockupPage.searchOrder(order)



    await orderLockupPage.validateOrderNotFound()



  })



  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ page }) => {



    const order = 'ABC-12345'



    await orderLockupPage.searchOrder(order)



    await orderLockupPage.validateOrderNotFound()



  })

})


