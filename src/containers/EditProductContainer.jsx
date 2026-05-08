import { useForm } from 'react-hook-form';
import EditProduct from '../components/editProduct/EditProduct';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductIdRequest,
  resetSelectProduct,
} from '../redux/selectProduct';
import { useEffect, useRef, useState } from 'react';
import {
  searchProductsExtraRequest,
  updateProductRequest,
} from '../redux/product';
import { updateActiveSupplier, updateProductSupplierPrice, updateProductBrand } from '../request/productRequest';
import Swal from 'sweetalert2';

function EditProductContainer(props) {
  const filterProducts = useSelector((state) => state.filterProduct);
  // console.log("llega?", props);
  const { id, closeModal } = props;
  const [selectedFiles, setSelectedFiles] = useState([]);
  // console.log(selectedFiles);
  const selectProduct = useSelector((state) => state.selectProduct);
  const methods = useForm({
    defaultValues: {
      article: '',
      location: '',
      rentabilidad: '',
      stock: '',
      price: '',
      description: '',
    },
  });
  const { reset, clearErrors, getValues } = methods;
  const dispatch = useDispatch();
  const forceFormResetRef = useRef(false);
  const pendingFormRestoreRef = useRef(null);

  const productUpdate = (data) => {
    data.stock = data.stock ? Number(data.stock) : null;
    // Price is now managed through supplier pricing (BrandSupplier), not manually
    data.price = null;
    // Rentabilidad is a percentage string in the form, backend expects it too or null
    if (!data.rentabilidad) {
      data.rentabilidad = null;
    }
    if (selectedFiles.length > 0) {
      data.images = selectedFiles;
    }
    dispatch(updateProductRequest({ productId: id, updateData: data })).then(
      (res) => {
        // Recargar solo el producto actual para reflejar los cambios en el modal
        forceFormResetRef.current = true;
        dispatch(getProductIdRequest(id));
        
        // Mostrar mensaje de éxito sin cerrar el modal
        Swal.fire({
          icon: 'success',
          title: 'Producto actualizado',
          text: 'Los cambios se guardaron correctamente',
          timer: 2000,
          showConfirmButton: false,
        });
        // NO recargamos la lista completa para evitar que se cierre el modal
        // La lista se actualizará automáticamente gracias al reducer de updateProductRequest
      }
    );
  };

  const handleChangeActiveSupplier = async (productId, supplierId) => {
    try {
      pendingFormRestoreRef.current = getValues();
      await updateActiveSupplier(productId, supplierId);

      Swal.fire({
        icon: 'success',
        title: 'Proveedor actualizado',
        text: 'El proveedor activo ha sido cambiado exitosamente',
        timer: 2000,
        showConfirmButton: false,
      });

      // Recargar solo el producto para obtener los precios actualizados
      dispatch(getProductIdRequest(id));
      // NO recargamos la lista completa para evitar que se cierre el modal
    } catch (error) {
      pendingFormRestoreRef.current = null;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar el proveedor activo',
        timer: 2500,
        showConfirmButton: false,
      });
    }
  };

  const handleUpdateSupplierPrice = async (productId, supplierId, purchasePrice) => {
    try {
      pendingFormRestoreRef.current = getValues();
      await updateProductSupplierPrice(productId, supplierId, purchasePrice);

      Swal.fire({
        icon: 'success',
        title: 'Precio actualizado',
        text: 'El precio del proveedor ha sido actualizado exitosamente',
        timer: 2000,
        showConfirmButton: false,
      });

      // Recargar solo el producto para obtener los precios actualizados
      dispatch(getProductIdRequest(id));
      // NO recargamos la lista completa para evitar que se cierre el modal
    } catch (error) {
      pendingFormRestoreRef.current = null;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo actualizar el precio',
        timer: 2500,
        showConfirmButton: false,
      });
    }
  };

  const handleUpdateProductBrand = async (productId, brandId) => {
    try {
      pendingFormRestoreRef.current = getValues();
      await updateProductBrand(productId, brandId);
      Swal.fire({
        icon: 'success',
        title: 'Marca actualizada',
        text: 'La marca del producto fue cambiada exitosamente',
        timer: 2000,
        showConfirmButton: false,
      });
      dispatch(getProductIdRequest(id));
      // NO recargamos la lista completa para evitar que se cierre el modal
    } catch (error) {
      pendingFormRestoreRef.current = null;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar la marca',
        timer: 2500,
        showConfirmButton: false,
      });
    }
  };


  useEffect(() => {
    dispatch(getProductIdRequest(id));
    return () => {
      dispatch(resetSelectProduct(null));
    };
  }, []);
  const productData = selectProduct?.data;

  useEffect(() => {
    if (!productData) return;

    if (pendingFormRestoreRef.current) {
      // Restore user's form values after a supplier/price/brand update
      // while still refreshing the product prop data for the UI
      reset({
        ...pendingFormRestoreRef.current,
      });
      clearErrors();
      pendingFormRestoreRef.current = null;
    } else {
      reset({
        article: productData.article ?? '',
        location: productData.location ?? '',
        rentabilidad: productData.rentabilidad ? productData.rentabilidad * 100 : '',
        stock: productData?.stock?.stock ?? '',
        price: productData?.price?.price ?? '',
        description: productData.description ?? '',
      });
      clearErrors();
      forceFormResetRef.current = false;
    }
  }, [productData, reset, clearErrors]);

  // console.log(selectProduct);

  return (
    <EditProduct
      files={{
        selectedFiles: selectedFiles,
        setSelectedFiles: setSelectedFiles,
      }}
      methods={methods}
      product={selectProduct}
      update={productUpdate}
      onChangeActiveSupplier={handleChangeActiveSupplier}
      onUpdateSupplierPrice={handleUpdateSupplierPrice}
      onUpdateProductBrand={handleUpdateProductBrand}
    />
  );
}

export default EditProductContainer;
