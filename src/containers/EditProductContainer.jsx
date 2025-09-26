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

function EditProductContainer(props) {
  const filterProducts = useSelector((state) => state.filterProduct);
  // console.log("llega?", props);
  const { id, closeModal } = props;
  const [selectedFiles, setSelectedFiles] = useState([]);
  // console.log(selectedFiles);
  const selectProduct = useSelector((state) => state.selectProduct);
  const methods = useForm();
  const dispatch = useDispatch();

  const productUpdate = (data) => {
    data.stock = data.stock ? Number(data.stock) : null;
    // Convertir precio con formato '10.574,05' a número
    data.price = data.price
      ? parseFloat(String(data.price).replace(/\./g, '').replace(',', '.'))
      : null;
    if (selectedFiles.length > 0) {
      data.images = selectedFiles;
    }
    // console.log("soy data", data);
    // return;
    dispatch(updateProductRequest({ productId: id, updateData: data })).then(
      (res) => {
        dispatch(searchProductsExtraRequest(filterProducts));
      }
    );
  };

  useEffect(() => {
    dispatch(getProductIdRequest(id));
    return () => {
      dispatch(resetSelectProduct(null));
    };
  }, []);

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
    />
  );
}

export default EditProductContainer;
