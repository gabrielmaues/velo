import { test } from '../support/fixtures';
import { generateOrderCode } from '../support/helpers';
import type { OrderDetails } from '../support/actions/orderLockupActions';

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {
  test.beforeEach(async ({ app }) => {
    // Arrange
    await app.orderLockup.open();
  });

  test('deve consultar um pedido aprovado', async ({ app }) => {
    // Test Data
    const order: OrderDetails = {
      number: 'VLO-BCRGD4',
      status: 'APROVADO',
      color: 'Glacier Blue',
      wheels: 'sport Wheels',
      customer: {
        name: 'Gabriel Maues',
        email: 'maumau@velo.dev',
      },
      payment: 'À Vista',
    };

    // Act
    await app.orderLockup.searchOrder(order.number);

    // Assert
    await app.orderLockup.validateOrderDetails(order);
    await app.orderLockup.validateStatusBadge(order.status);
  });

  test('deve consultar um pedido reprovado', async ({ app }) => {
    // Test Data
    const order: OrderDetails = {
      number: 'VLO-X186FV',
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Steve Jobs',
        email: 'jobs@apple.com',
      },
      payment: 'À Vista',
    };

    // Act
    await app.orderLockup.searchOrder(order.number);

    // Assert
    await app.orderLockup.validateOrderDetails(order);
    await app.orderLockup.validateStatusBadge(order.status);
  });

  test('deve consultar um pedido em analise', async ({ app }) => {
    // Test Data
    const order: OrderDetails = {
      number: 'VLO-A6U0IQ',
      status: 'EM_ANALISE',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Joao da Silva',
        email: 'joao@velo.dev',
      },
      payment: 'À Vista',
    };

    // Act
    await app.orderLockup.searchOrder(order.number);

    // Assert
    await app.orderLockup.validateOrderDetails(order);
    await app.orderLockup.validateStatusBadge(order.status);
  });

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {
    const order = generateOrderCode();

    await app.orderLockup.searchOrder(order);
    await app.orderLockup.validateOrderNotFound();
  });

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ app }) => {
    const order = 'ABC-12345';

    await app.orderLockup.searchOrder(order);
    await app.orderLockup.validateOrderNotFound();
  });
});
