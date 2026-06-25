import { expect, test } from '../support/fixtures';

/// AAA - Arrange, Act, Assert

test.describe('Configurador de Veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open();
  });

  test('deve manter o preço base e atualizar o preview ao trocar a cor exterior', async ({ app }) => {
    // Arrange - Passo 1: preço inicial com cor padrão e rodas Aero
    await app.configurator.expectTotalPrice('R$ 40.000,00');
    await app.configurator.expectCarPreview('glacier-blue', 'aero');

    // Act - Passo 2: trocar cor exterior sem alterar o preço
    await app.configurator.selectExteriorColor('Midnight Black');

    // Assert - verifica se o preço se manteve o mesmo e a imagem atualizou
    await app.configurator.expectTotalPrice('R$ 40.000,00');
    await app.configurator.expectCarPreview('midnight-black', 'aero');
  });

  test('deve recalcular o preço total e atualizar o preview ao alterar as rodas', async ({ app }) => {
    // Arrange: preço inicial com cor padrão e rodas Aero
    await app.configurator.expectTotalPrice('R$ 40.000,00');
    await app.configurator.expectCarPreview('glacier-blue', 'aero');

    // Act: selecionar rodas Sport com acréscimo de R$ 2.000
    await app.configurator.selectWheelType('Sport Wheels');

    // Assert: verifica acréscimo de preço e nova imagem
    await app.configurator.expectTotalPrice('R$ 42.000,00');
    await app.configurator.expectCarPreview('glacier-blue', 'sport');

    // Act: voltar para rodas Aero
    await app.configurator.selectWheelType('Aero Wheels');

    // Assert: verifica restauração do preço base
    await app.configurator.expectTotalPrice('R$ 40.000,00');
    await app.configurator.expectCarPreview('glacier-blue', 'aero');
  });
  test('CT03 - deve calcular o preço total ao adicionar e remover opcionais e persistir no checkout', async ({ app }) => {
    // Arrange: preço inicial R$ 40.000,00
    await app.configurator.expectTotalPrice('R$ 40.000,00');

    // Act / Assert (Passo 1): Marcar Precision Park (+ R$ 5.500)
    await app.configurator.toggleOptional('opt-precision-park');
    await app.configurator.expectTotalPrice('R$ 45.500,00');

    // Act / Assert (Passo 2): Marcar Flux Capacitor (+ R$ 5.000)
    await app.configurator.toggleOptional('opt-flux-capacitor');
    await app.configurator.expectTotalPrice('R$ 50.500,00');

    // Act / Assert (Passo 3): Desmarcar ambos e voltar para o preço base
    await app.configurator.toggleOptional('opt-precision-park');
    await app.configurator.toggleOptional('opt-flux-capacitor');
    await app.configurator.expectTotalPrice('R$ 40.000,00');

    // Act / Assert (Passo 4): Checkout redireciona para a tela /order
    await app.configurator.proceedToCheckout();
  });
});
