import { useForm } from 'react-hook-form';
import EditProduct from '../components/editProduct/EditProduct';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductIdRequest,
  resetSelectProduct,
} from '../redux/selectProduct';
import { useEffect, useState } from 'react';
import {
  searchProductsExtraRequest,
  updateProductRequest,
} from '../redux/product';
import { updateActiveSupplier, updateProductSupplierPrice } from '../request/productRequest';
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
      stock: '',
      price: '',
      description: '',
    },
  });
  const dispatch = useDispatch();

  const productUpdate = (data) => {
    data.stock = data.stock ? Number(data.stock) : null;
    // Price is now managed through supplier pricing (BrandSupplier), not manually
    data.price = null;
    if (selectedFiles.length > 0) {
      data.images = selectedFiles;
    }
    dispatch(updateProductRequest({ productId: id, updateData: data })).then(
      (res) => {
        dispatch(searchProductsExtraRequest(filterProducts));
      }
    );
  };

  const handleChangeActiveSupplier = async (productId, supplierId) => {
    try {
      await updateActiveSupplier(productId, supplierId);
      
      Swal.fire({
        icon: 'success',
        title: 'Proveedor actualizado',
        text: 'El proveedor activo ha sido cambiado exitosamente',
        timer: 2000,
        showConfirmButton: false,
      });

      // Recargar el producto para obtener los precios actualizados
      dispatch(getProductIdRequest(id));
      dispatch(searchProductsExtraRequest(filterProducts));
    } catch (error) {
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
      await updateProductSupplierPrice(productId, supplierId, purchasePrice);
      
      Swal.fire({
        icon: 'success',
        title: 'Precio actualizado',
        text: 'El precio del proveedor ha sido actualizado exitosamente',
        timer: 2000,
        showConfirmButton: false,
      });

      // Recargar el producto para obtener los precios actualizados
      dispatch(getProductIdRequest(id));
      dispatch(searchProductsExtraRequest(filterProducts));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo actualizar el precio',
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

  useEffect(() => {
    if (selectProduct?.data) {
      methods.reset({
        article: selectProduct.data.article ?? '',
        location: selectProduct.data.location ?? '',
        stock: selectProduct.data?.stock?.stock ?? '',
        price: selectProduct.data?.price?.price ?? '',
        description: selectProduct.data.description ?? '',
      });
      methods.clearErrors();
    }
  }, [selectProduct?.data, methods]);

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
    />
  );
}

export default EditProductContainer;
