import React, { useEffect, useRef, useState } from 'react';
import styles from './customSearch.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAllClientsByTextRequest } from '../../redux/searchClient';
import { getClientIdRequest } from '../../redux/client';

function CustomSearch(props) {
  const { width, icon, type, placeholder } = props;
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.searchClients);
  const [classDivContainer, setClassDivContainer] = useState('inputContainer');
  const [classResContainer, setClassResContainer] =
    useState('resContainerNone');
  const inputRef = useRef();
  const debounceRef = useRef(null);

  const handleDocumentClick = (event) => {
    // Verifica si el clic fue fuera del componente y del input
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      // Oculta los resultados
      setClassResContainer('resContainerNone');
    }
  };


  const handleInputChange = (event) => {
    const value = event.target.value;

    // Limpia el debounce previo si existe
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Configura el nuevo debounce
    debounceRef.current = setTimeout(() => {
      dispatch(getAllClientsByTextRequest(value)).then(() => {
        setClassResContainer('resContainer');
      });
    }, 300); // 300ms de espera
  };
  const onSelect = (id) => {
    dispatch(getClientIdRequest(id)).then(() => {
      setClassResContainer('resContainerNone');
    });
  };

  useEffect(() => {
    // Agrega un escucha de clic al documento cuando se monta el componente
    document.addEventListener('click', handleDocumentClick);

    // Limpia el escucha de clic cuando el componente se desmonta
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []); // El array vacío indica que este efecto se ejecuta solo al montar y desmontar el componente
  return (
    <div
      style={{ marginBottom: '15px' }}
      className={`${styles[width]}`}
      ref={inputRef}
    >
      <div
        onBlur={() => {
          setClassDivContainer('inputContainer');
        }}
        className={`${styles[classDivContainer]}`}
      >
        <i className={`${styles.searchIcon} ${icon}`}></i>
        <input
          onFocus={() => {
            setClassDivContainer('inputContainerActive');
          }}
          className={styles.input}
          type={type}
          placeholder={placeholder}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles[classResContainer]}>
        <ul className={styles.liContaier}>
          {clients?.data?.clients?.map((client, i) => (
            <li
              key={i}
              className={styles.option}
              onClick={() => {
                onSelect(client.id);
              }}
            >
              {client?.razonSocial?.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CustomSearch;
