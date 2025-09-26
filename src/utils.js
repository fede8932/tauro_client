export function isSupplierInBrand(supplier, brand) {
  const supplierId = supplier.id;
  const brandSupplierIds = brand.brandSuppliers.map((bs) => bs.supplierId);
  return brandSupplierIds.includes(supplierId);
}
export function dateConverter(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que se suma 1.
  const year = date.getFullYear();

  const formattedDate = `${day < 10 ? '0' : ''}${day}-${
    month < 10 ? '0' : ''
  }${month}-${year}`;
  return formattedDate;
}
export function dateConverterWHour(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que se suma 1.
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedDate = `${day < 10 ? '0' : ''}${day}-${
    month < 10 ? '0' : ''
  }${month}/${year}:${hours < 10 ? '0' : ''}${hours}:${
    minutes < 10 ? '0' : ''
  }${minutes}`;

  return formattedDate;
}
export function redondearADosDecimales(numero) {
  return Math.round(numero * 100) / 100;
}
export function convertToDate(string) {
  const fecha = new Date(string);
  return fecha.toISOString();
}
export function formatNumberWithLeadingZeros(number, desiredLength) {
  const numString = String(number);
  const zerosToAdd = Math.max(0, desiredLength - numString.length);
  const leadingZeros = '0'.repeat(zerosToAdd);
  return leadingZeros + numString;
}
export function camelCaseToText(cadenaCamelCase) {
  // Agregar espacios entre las palabras en CamelCase usando una expresión regular
  const cadenaConEspacios = cadenaCamelCase.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Convertir la cadena resultante a mayúsculas
  const cadenaMayusculas = cadenaConEspacios.toUpperCase();

  return cadenaMayusculas;
}

export function fechaConverter() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que se suma 1.
  const year = date.getFullYear();

  const formattedDate = `${day < 10 ? '0' : ''}${day}-${
    month < 10 ? '0' : ''
  }${month}-${year}`;
  return formattedDate;
}
export function controlOrderString(num) {
  const formatted = `CO-${String(num).padStart(7, '0')}`.slice(-10);
  return formatted;
}
export function pickingOrderString(num) {
  const formatted = `PE-${String(num).padStart(7, '0')}`.slice(-10);
  return formatted;
}
export function buyOrderString(num) {
  const formatted = `OC-${String(num).padStart(6, '0')}`.slice(-10);
  return formatted;
}
export function ajustOrderString(num) {
  const formatted = `OA-${String(num).padStart(6, '0')}`.slice(-10);
  return formatted;
}

//Funcion que recibe un array de descuentos/recargos y el objeto brandProduct. Retorna un obj con el precio y precio + iva a renderizar con el descuento/recargo correspondiente (redondeado a 2 decimales)
export function discountApplication(discountArray, product, noRound) {
  let initPrice = product.price.price * (1 + product.brand.rentabilidad);
  discountArray?.map((discount) => {
    if (product.brand.brandId == discount.brandId) {
      initPrice *= 1 + discount.porcentaje;
    }
  });
  const endPrice = initPrice * 1.21;
  return {
    initPrice: noRound ? initPrice : redondearADosDecimales(initPrice),
    endPrice: noRound ? endPrice : redondearADosDecimales(endPrice),
  };
}
//Funcion que recibe un array de descuentos/recargos y el objeto brandProduct. Retorna un obj con el precio y precio + iva a renderizar con el descuento/recargo correspondiente (redondeado a 2 decimales)
export function discountApplicationV2(discountArray, product, noRound) {
  let initPrice = product.price.price * (1 + product.brand.rentabilidad);
  discountArray?.map((discount) => {
    if (product.brand.id == discount.brandId) {
      initPrice *= 1 + discount.porcentaje;
    }
  });
  const endPrice = initPrice * 1.21;
  return {
    initPrice: noRound ? initPrice : redondearADosDecimales(initPrice),
    endPrice: noRound ? endPrice : redondearADosDecimales(endPrice),
  };
}

//Funcion que quita los guiones al cuit/cuil
export const cuitTransformToNumber = (cuit) => {
  return parseInt(cuit.replace(/-/g, ''), 10) || 0;
};
export function generarNumeroAleatorio() {
  // Generar un número aleatorio entre 10000000 y 99999999 (8 dígitos)
  var numeroAleatorio = Math.floor(Math.random() * 90000000) + 10000000;
  return numeroAleatorio;
}
export function formatFactDate(yyyymmdd) {
  // console.log("yyyymmdd:", yyyymmdd);
  // Extraer el año, mes y día del string y convertirlos a números
  const year = yyyymmdd.slice(0, 4);
  const month = yyyymmdd.slice(4, 6);
  const day = yyyymmdd.slice(6, 8);

  // Formatear la fecha en el formato "dd-mm-yyyy"
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}
export function recortString(string, caracteres) {
  return string.slice(0, caracteres);
}
export function tabProducts(products, rol) {
  let ans = {
    list: [],
    totalRows: products.totalRows,
    totalPages: products.totalPages,
  };
  ans.list = products.list
    ? products.list.map((item) => {
        let ansItem = {
          code: item.article,
          description: recortString(item.description.toUpperCase(), 120),
          brand: item.brand.name,
          cost: rol == 7 ? '' : `$ ${item.price.price}`,
          sellPrice:
            rol == 7
              ? ''
              : `$ ${redondearADosDecimales(
                  item.price.price * (1 + item.brand.rentabilidad)
                )}`,
          priceCIva:
            rol == 7
              ? ''
              : `$ ${redondearADosDecimales(
                  item.price.price * (1 + item.brand.rentabilidad) * 1.21
                )}`,
          stock: item.stock.stock,
          location: item.location,
          images: item.images,
          actions: null,
          id: item.id,
        };
        return ansItem;
      })
    : [];
  return ans;
}
export function tabBrands(brands) {
  let ans = {
    list: [],
    totalRows: brands.length,
    totalPages: 1,
  };
  ans.list = brands
    ? brands.map((item) => {
        // console.log(item);
        let ansItem = {
          id: item.id,
          code: item.code.toUpperCase(),
          name: item.name.toUpperCase(),
          seFactura: item.seFactura,
          supplier:
            item.brandSuppliers[0]?.supplier?.razonSocial?.toUpperCase(),
          rentabilidad: `${item.rentabilidad * 100} %`,
          brandSuppliers: item.brandSuppliers,
          check: item.ecommerce,
          actions: null,
        };
        return ansItem;
      })
    : [];
  return ans;
}
export function convertirPorcentajeANumero(stringPorcentaje) {
  // Reemplazar '%' con una cadena vacía para eliminarlo
  var sinPorcentaje = stringPorcentaje.replace(/%/g, '');

  // Convertir a número de punto flotante
  var numero = parseFloat(sinPorcentaje);

  // Retornar el número
  return numero;
}
export function tabReport(products) {
  const { list, totalPages, totalRows } = products;
  let ans = {
    list: [],
    totalRows: totalRows,
    totalPages: totalPages,
  };
  ans.list = list
    ? list.map((item) => {
        // console.log(item);
        let ansItem = {
          id: item.id,
          code: item.product.article.toUpperCase(),
          description: item.product.description.toUpperCase(),
          brand: item.brand.name.toUpperCase(),
          amount: item.amount,
          actions: null,
        };
        return ansItem;
      })
    : [];
  return ans;
}
export const filterOrders = (movs) => {
  let orderList = [];
  movs.map((mov, i) => {
    if (i == 0) {
      orderList.push(mov.purchaseOrder);
    } else {
      if (!orderList.some((order) => order.id == mov.purchaseOrder.id)) {
        orderList.push(mov.purchaseOrder);
      }
    }
  });
  return orderList;
};
export const filterOrdersId = (movs) => {
  let orderList = [];
  movs.map((mov, i) => {
    if (i == 0) {
      orderList.push(mov.purchaseOrder.id);
    } else {
      if (!orderList.some((id) => id == mov.purchaseOrder.id)) {
        orderList.push(mov.purchaseOrder.id);
      }
    }
  });
  return orderList;
};
export const filterMovsId = (movs) => {
  let movIdList = [];
  movs.map((mov, i) => {
    if (mov.marc) {
      movIdList.push(mov.id);
    }
  });
  return movIdList;
};
export const obtenerIds = (arrayDeObjConPropId, init = 0) => {
  let count = init;
  let arrayDeIds = [];
  let tamDeArray = arrayDeObjConPropId.length;

  // Verificar si count es menor que el tamaño del array
  if (count < tamDeArray) {
    // Agregar el ID actual al arrayDeIds
    arrayDeIds.push(arrayDeObjConPropId[count].id);

    // Llamar recursivamente a obtenerIds con el siguiente elemento del array
    arrayDeIds = arrayDeIds.concat(obtenerIds(arrayDeObjConPropId, count + 1));
  }

  // Devolver el arrayDeIds después de recorrer todos los elementos
  return arrayDeIds;
};
export function sortByBrandName(items) {
  return items.sort((a, b) => {
    const brandNameA = a.product.brand.name.toLowerCase();
    const brandNameB = b.product.brand.name.toLowerCase();

    if (brandNameA < brandNameB) {
      return -1;
    }
    if (brandNameA > brandNameB) {
      return 1;
    }
    return 0;
  });
}
export function getBillType(type, billType) {
  if (type == 'Factura' && billType == 0) return 'Presupuesto';
  if (type == 'Nota de crédito' && billType == 2) return 'Nota de crédito P';
  return type;
}
export function formatearFecha(fecha) {
  // Obtener las partes de la fecha
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // Los meses en JavaScript comienzan desde 0
  const anio = fecha.getFullYear();

  // Agregar ceros a la izquierda si es necesario
  const diaConCeros = dia.toString().padStart(2, '0');
  const mesConCeros = mes.toString().padStart(2, '0');

  // Formatear la fecha y devolverla como cadena
  return `${diaConCeros}-${mesConCeros}-${anio}`;
}
export function convertirFechaISOaDDMMYYYY(fechaISO) {
  // Crear un objeto Date a partir de la cadena ISO
  const fecha = new Date(fechaISO);

  // Obtener las partes de la fecha
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear();
  // Formatear y devolver la fecha en el formato deseado
  return `${dia}-${mes}-${anio}`;
}

export function convertirFechaISOaDDMMYYYYHHMM(fechaISO) {
  // Crear un objeto Date a partir de la cadena ISO
  const fecha = new Date(fechaISO);

  // Obtener la fecha y hora en el huso horario de Argentina
  const opciones = {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  // Convertir la fecha usando el formato y zona horaria correctos
  const fechaFormateada = fecha.toLocaleString('es-AR', opciones);

  // Formatear la cadena para ajustarla a 'dd-mm-yyyy hh:mm'
  const [fechaPartes, horaPartes] = fechaFormateada.split(', ');
  const [dia, mes, anio] = fechaPartes.split('/');

  return `${dia}-${mes}-${anio} ${horaPartes}`;
}
export function convertirFechaISOaDDMMYYYYHHMM_V2(fechaISO) {
  const [yyyy, mm, dd] = fechaISO.split("T")[0].split("-");
  return `${dd}-${mm}-${yyyy}`;
}

export function traslateRol(rol) {
  // console.log(rol);
  let Trol;
  switch (rol) {
    case 'SYSTEM':
      Trol = 'ADMINISTRADOR';
      break;
    case 'ADMIN':
      Trol = 'ADMINISTRADOR';
      break;
    case 'SELLER':
      Trol = 'VENDEDOR';
      break;
    case 'CLIENT':
      Trol = 'CLIENTE';
      break;
    case 'BOSS':
      Trol = 'ENCARGADO';
      break;
    case 'BOSS':
      Trol = 'ENCARGADO';
      break;
    case 'ACCOUNTING':
      Trol = 'ADMINISTRATIVO';
      break;
    case 'OPERATOR':
      Trol = 'OPERARIO';
      break;
    default:
      Trol = 'NO DEFINIDO';
      break;
  }
  return Trol;
}

export const sellOrderButtonConfirm = (list) => {
  let count = 0;
  let conditions = { marc: false, allOpen: true };
  while (count < list?.length) {
    if (list[count].marc) {
      conditions.marc = true;
    }
    if (list[count].status != 'Open' && list[count].marc) {
      conditions.allOpen = false;
    }
    count++;
  }
  return conditions.marc && conditions.allOpen;
};
export const sellOrderButtonUnif = (list) => {
  let count = 0;
  let countMarc = 0;
  let clientsId = [];
  let conditions = {
    marc: false,
    allOpenConfirm: true,
    onlyClient: true,
    moreOneMarc: false,
  };
  while (count < list?.length) {
    if (list[count].marc) {
      conditions.marc = true;
      countMarc++;
    }
    if (
      list[count].status != 'Open' &&
      list[count].status != 'Confirm' &&
      list[count].marc
    ) {
      conditions.allOpenConfirm = false;
    }
    if (!clientsId.includes(list[count].clientId) && list[count].marc) {
      clientsId.push(list[count].clientId);
    }
    count++;
  }
  if (clientsId.length > 1) conditions.onlyClient = false;
  if (countMarc > 1) conditions.moreOneMarc = true;
  // console.log(conditions);
  return (
    conditions.marc &&
    conditions.allOpenConfirm &&
    conditions.onlyClient &&
    conditions.moreOneMarc
  );
};

export async function convertImageToBase64(imageUrl) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
export const waitForImagesToLoad = (nuevaVentana) => {
  return new Promise((resolve) => {
    const images = nuevaVentana.document.images;
    let loadedImagesCount = 0;

    if (images.length === 0) {
      resolve();
      return;
    }

    for (let i = 0; i < images.length; i++) {
      if (images[i].complete) {
        loadedImagesCount++;
        if (loadedImagesCount === images.length) {
          resolve();
        }
      } else {
        images[i].addEventListener('load', () => {
          loadedImagesCount++;
          if (loadedImagesCount === images.length) {
            resolve();
          }
        });
      }
    }
  });
};

export const checkActive = (obj) => {
  // console.log("tipo:", obj.type, "pendiente:", obj.pending);
  if (obj.type == 0 && obj.pending) return false;
  return true;
};

export const newPayButtonActive = (list) => {
  // Verificar si todos los objetos tienen marc como falso
  const allMarcFalse = list.every((item) => item.marc === false);

  if (allMarcFalse) {
    return true;
  }

  // Filtrar los objetos donde marc es verdadero
  const markedItems = list.filter((item) => item.marc === true);

  // Verificar si hay inconsistencias en el valor de esOferta (ignorar null)
  const hasInconsistentEsOferta =
    markedItems.some((item) => item.esOferta === true) &&
    markedItems.some((item) => item.esOferta === false);

  if (markedItems.length > 1 && hasInconsistentEsOferta) {
    return true;
  }

  return false;
};

export function compareNCListFactList(factList, ncList) {
  let totalFact = 0;
  let totalNc = 0;
  factList.map((f) => {
    totalFact += f.total;
  });
  ncList.map((nc) => {
    if (nc.marc) {
      totalNc += nc.total;
    }
  });
  return !totalFact == totalNc;
}

export function billDateTostringDate(fecha) {
  //Convierte 20241104 en 04-11-2024
  // Extraemos el año, mes y día del string
  const año = fecha.slice(0, 4);
  const mes = fecha.slice(4, 6);
  const dia = fecha.slice(6, 8);

  // Retornamos la fecha en el formato deseado
  return `${dia}-${mes}-${año}`;
}
export function presDateIsoTostringDate(fechaISO) {
  // Convertimos el string ISO a un objeto Date
  const fecha = new Date(fechaISO);

  // Obtenemos el día, mes y año
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11, sumamos 1
  const año = fecha.getFullYear();

  // Retornamos en el formato deseado
  return `${dia}-${mes}-${año}`;
}
export function numberToString(numero) {
  if (!numero && numero !== 0) return '';

  // Separar la parte entera y decimal
  let [entero, decimal] = numero.toString().split('.');

  // Formatear la parte entera con punto como separador de miles
  const options = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  };
  entero = Number(entero).toLocaleString('es-ES', options);

  // Asegurar que la parte decimal tenga siempre dos dígitos
  decimal = (decimal || '00').slice(0, 2).padEnd(2, '0');

  // Combinar las partes formateadas
  return `${entero},${decimal}`; // Nota: Hemos cambiado la coma por un punto
}
export function searchInList(arrayString, string1, string2) {
  return arrayString.every(
    (word) => string1.includes(word) || string2.includes(word)
  );
}
export function convertirStringANumero(input) {
  if (typeof input !== 'string') {
    return 0;
  }

  // Reemplaza los puntos como separadores de miles y cambia la coma decimal a un punto
  const numero = input.replace(/\./g, '').replace(',', '.');

  // Convierte el string resultante en un número flotante
  return parseFloat(numero);
}
export function selectStylesByDate(fechaStr) {
  const fecha = new Date(fechaStr);
  const hoy = new Date();
  // Calcular la diferencia en milisegundos
  const diferenciaMs = hoy - fecha;
  // Convertir la diferencia a días
  const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
  if (dias < 10) return 'green';
  if (dias < 20) return 'blue';
  if (dias < 32) return 'yellow';
  return 'red';
}
export function selectStylesByDateClient(fechaStr) {
  // console.log(fechaStr)
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr);
  const hoy = new Date();
  // Calcular la diferencia en milisegundos
  const diferenciaMs = hoy - fecha;
  // Convertir la diferencia a días
  const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
  if (dias < 10) return 'rgba(86, 255, 158, 0.3)';
  if (dias < 20) return 'rgba(0, 109, 247 , 0.3)';
  if (dias < 32) return 'rgba(255, 219, 86, 0.3)';
  return 'rgba(255, 86, 106, 0.3)';
}
