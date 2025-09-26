import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import SearchSupCurrentAcount from '../components/searchSupCurrentAcount/SearchSupCurrentAcount';
import { searchSupCurrentAcountRequest } from '../request/supMovementRequest';
import { getMovSupplierRequest } from '../redux/supCurrentAcount';
import { Tab, TabPane } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { newPaymentOrderRequest } from '../redux/supPaymentOrder';
import SupPaymentOrder from '../components/supPaymentOrder/SupPaymentOrder';
import ProtectedComponent from '../protected/protectedComponent/ProtectedComponent';

function SearchSupCurrentAcountContainer(props) {
  const dispatch = useDispatch();
  const [currentAcount, setCurrentAcount] = useState(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const pathSegments = currentPath.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  const accountId = parseInt(lastSegment, 10);

  const { actualizar } = useSelector((state) => state.supCurrentAcount);

function nuevaOrdenDePago(total, movements, options = {}) {
  if (total < 0) {
    Swal.fire({
      icon: 'error',
      title: 'Monto inválido',
      text: 'No podés generar una orden con monto negativo.',
      confirmButtonText: 'Entendido',
    });
    return;
  }
  if (movements.length <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'Lista incompleta',
      text: 'No podés generar una orden sin seleccionar movimientos',
      confirmButtonText: 'Entendido',
    });
    return;
  }

  // Verificar si hay descuento disponible
  const hasDiscount = currentAcount?.supplier?.descuento && currentAcount.supplier.descuento > 0;
  const discountPercentage = currentAcount?.supplier?.descuento || 0;
  
  // Calcular montos máximos
  const maxWithoutDiscount = total;
  const maxWithDiscount = hasDiscount ? total * (1 - discountPercentage) : total;
  
  // Determinar valores iniciales
  const initialDiscountChecked = hasDiscount;
  const initialMaxAmount = initialDiscountChecked ? maxWithDiscount : maxWithoutDiscount;
  const initialPaymentAmount = initialMaxAmount;

  // Mostrar modal para ingresar monto de pago parcial
  Swal.fire({
    title: 'Crear Orden de Pago',
    html: `
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px; text-align: left;">
        <label>
          <input type="checkbox" id="applyDiscount" ${initialDiscountChecked ? 'checked' : ''} ${!hasDiscount ? 'disabled' : ''} style="margin-right: 8px;">
          Aplicar ${(discountPercentage * 100).toFixed(1)}% de descuento
        </label>
        <label>
          <input type="checkbox" id="payTotal" checked style="margin-right: 8px;">
          Pagar total
        </label>
      </div>
      <div style="text-align: left; margin-bottom: 15px;">
        <label for="paymentAmount" style="display: block; margin-bottom: 5px; font-weight: bold;">
          <span id="maxAmountLabel">Monto a pagar (máximo: $${initialMaxAmount.toFixed(2)}):</span>
        </label>
        <input 
          type="number" 
          id="paymentAmount" 
          class="swal2-input" 
          placeholder="Ingrese el monto" 
          value="${initialPaymentAmount.toFixed(2)}"
          max="${initialMaxAmount}"
          min="0"
          step="0.01"
          style="margin: 0;"
          disabled
        />
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Crear Orden',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    didOpen: () => {
      // Obtener referencias a los elementos
      const discountCheckbox = document.getElementById('applyDiscount');
      const payTotalCheckbox = document.getElementById('payTotal');
      const paymentInput = document.getElementById('paymentAmount');
      const maxAmountLabel = document.getElementById('maxAmountLabel');
      
      // Establecer el estado inicial del checkbox "Pagar total" basado en el parámetro
      if (options.total !== undefined) {
        payTotalCheckbox.checked = options.total;
      }

      // Si no hay descuento disponible, forzar el checkbox de descuento a apagado y deshabilitado
      if (!hasDiscount) {
        discountCheckbox.checked = false;
        discountCheckbox.disabled = true;
      }
      
      // Función para actualizar el monto máximo y el input
      const updateAmountAndInput = () => {
        const isDiscountChecked = discountCheckbox.checked;
        const isPayTotalChecked = payTotalCheckbox.checked;
        const newMaxAmount = isDiscountChecked ? maxWithDiscount : maxWithoutDiscount;
        
        // Actualizar el máximo del input
        paymentInput.max = newMaxAmount;
        
        // Actualizar el label
        maxAmountLabel.textContent = `Monto a pagar (máximo: $${newMaxAmount.toFixed(2)}):`;
        
        // Si está marcado "Pagar total", usar el monto máximo y deshabilitar input
        if (isPayTotalChecked) {
          paymentInput.value = newMaxAmount.toFixed(2);
          paymentInput.disabled = true;
        } else {
          paymentInput.disabled = false;
          // Ajustar el valor actual si excede el nuevo máximo
          const currentValue = parseFloat(paymentInput.value);
          if (currentValue > newMaxAmount) {
            paymentInput.value = newMaxAmount.toFixed(2);
          }
        }
      };
      
      // Event listener para el checkbox de descuento
      discountCheckbox.addEventListener('change', updateAmountAndInput);
      
      // Event listener para el checkbox de pagar total
      payTotalCheckbox.addEventListener('change', updateAmountAndInput);
    },
    preConfirm: () => {
      const paymentAmount = parseFloat(document.getElementById('paymentAmount').value);
      const applyDiscount = document.getElementById('applyDiscount').checked;
      const currentMaxAmount = applyDiscount ? maxWithDiscount : maxWithoutDiscount;
      
      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        Swal.showValidationMessage('Por favor ingrese un monto válido mayor a 0');
        return false;
      }
      
      // Use a small tolerance for floating-point comparison to avoid precision issues
      const tolerance = 0.01;
      if (paymentAmount > currentMaxAmount + tolerance) {
        Swal.showValidationMessage(`El monto no puede ser mayor a $${currentMaxAmount.toFixed(2)}`);
        return false;
      }
      
      const payTotal = document.getElementById('payTotal').checked;
      return { paymentAmount, applyDiscount, payTotal };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { paymentAmount, applyDiscount, payTotal } = result.value;
      
      const mensaje = paymentAmount === 0
        ? 'Vas a generar una <b>compensación</b>.'
        : `Vas a generar una <b>orden de pago por $${paymentAmount.toFixed(2)}</b>.`;

      // Confirmación final
      Swal.fire({
        title: '¿Estás seguro?',
        html: mensaje,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      }).then((confirmResult) => {
        if (confirmResult.isConfirmed) {
          dispatch(
            newPaymentOrderRequest({
              id: accountId,
              movementIds: movements.map((obj) => obj.id),
              aplicarDescuento: applyDiscount,
              amount: paymentAmount, // Agregar el monto para pago parcial
              total: payTotal // Agregar el flag de total
            })
          )
            .then((res) => {
              if (res.error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: `Ocurrió un error: ${res.error.message}`,
                });
                return;
              }
              Swal.fire({
                icon: 'success',
                title: '¡Listo!',
                text: paymentAmount === 0
                  ? 'La compensación fue generada con éxito.'
                  : 'La orden de pago fue generada correctamente.',
              });
            })
            .catch((err) => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Ocurrió un error: ${err.message}`,
              });
            });
        }
      });
    }
  });
}

  const panes = [
    {
      menuItem: 'Movimientos',
      render: () => (
        <TabPane>
          <SearchSupCurrentAcount
            currentAcount={currentAcount}
            nuevaOrdenDePago={nuevaOrdenDePago}
          />
        </TabPane>
      ),
    },
    {
      menuItem: 'Ordenes de pago',
      render: () => (
        <TabPane>
          <ProtectedComponent listAccesss={[1, 2, 5]}>
            <SupPaymentOrder accountId={accountId} />
          </ProtectedComponent>
        </TabPane>
      ),
    },
  ];

  useEffect(() => {
    searchSupCurrentAcountRequest(accountId).then((res) =>
      setCurrentAcount(res)
    );
  }, [accountId, actualizar]);

  return <Tab panes={panes} />;
}

export default SearchSupCurrentAcountContainer;
