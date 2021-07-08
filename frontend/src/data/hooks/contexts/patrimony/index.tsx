import React, { createContext, useCallback, useContext, useState } from 'react';
import { AxiosHttpClient } from '../../../../infra/http/axios-http-client';
import {
  IUser,
  PatrimonyContext,
  RegisterPatrimony,
  StatementList,
} from './types';
import { useToast } from '../../toast';

const PatrimonyContextData = createContext<PatrimonyContext>(
  {} as PatrimonyContext,
);

const Patrimony: React.FC = ({ children }) => {
  const [patrimonyList, setPatriomonyList] = useState<RegisterPatrimony[]>([]);
  const [patrimonyItem, setPatrimonyItem] = useState<RegisterPatrimony>(
    {} as RegisterPatrimony,
  );
  const [statementList, setStatementList] = useState<StatementList[]>([]);
  const { addToast } = useToast();

  const getPatrimonyList = useCallback(async () => {
    const httpClient = new AxiosHttpClient();

    try {
      const response = await httpClient.request({
        url: 'patrimony-list',
        method: 'get',
      });

      setPatriomonyList(response.body.patrimonyList);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }, []);

  const getPatrimonyListByPage = useCallback(async (page: number) => {
    const httpClient = new AxiosHttpClient();

    try {
      const response = await httpClient.request({
        url: `patrimony-list/${page}`,
        method: 'get',
      });

      setPatriomonyList(response.body.patrimonyList);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }, []);

  const getPatrimonyByCode = useCallback(
    async (code: string, only?: boolean) => {
      const httpClient = new AxiosHttpClient();

      try {
        const response = await httpClient.request({
          url: `patrimony/${code}`,
          method: 'get',
        });

        const data = [response.body.patrimony];

        if (response.statusCode === 200) {
          if (only) {
            setPatrimonyItem(response.body.patrimony);
            return Promise.resolve(response);
          }
          setPatriomonyList(data);
        } else {
          setPatriomonyList([]);
        }
        return Promise.resolve(response);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    [],
  );

  const registerPatrimony = useCallback(
    async (data) => {
      const httpClient = new AxiosHttpClient();

      try {
        const { statusCode, body } = await httpClient.request({
          url: 'patrimony/create',
          method: 'post',
          body: data,
        });

        if (statusCode === 204) {
          addToast({
            title: 'Sucesso',
            type: 'success',
            message: 'Patrimônio cadastrado!',
          });

          getPatrimonyList();
        }
        if (statusCode === 400) {
          addToast({
            title: 'Erro',
            type: 'error',
            message: body.error,
          });
        }
      } catch (error) {
        addToast({
          title: 'Erro',
          type: 'error',
          message: 'Erro ao cadastrar patrimônio',
        });
      }
    },
    [addToast, getPatrimonyList],
  );

  const deletePatrimony = useCallback(
    async (id: string) => {
      const httpClient = new AxiosHttpClient();
      try {
        const { statusCode } = await httpClient.request({
          url: `patrimony/${id}`,
          method: 'delete',
        });

        if (statusCode === 204) {
          addToast({
            title: 'Sucesso',
            type: 'success',
            message: 'Patrimônio excluído!',
          });

          getPatrimonyList();
        }
      } catch (error) {
        addToast({
          title: 'Erro',
          type: 'error',
          message: 'Erro ao excluir patrimônio',
        });
      }
    },
    [addToast, getPatrimonyList],
  );

  const getStatementList = useCallback(async () => {
    const httpClient = new AxiosHttpClient();
    try {
      const response = await httpClient.request({
        url: 'statement-list',
        method: 'get',
      });

      setStatementList(response.body.statementList);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }, []);

  const updatePatrimony = useCallback(
    async (data: RegisterPatrimony) => {
      const httpClient = new AxiosHttpClient();

      try {
        const { statusCode } = await httpClient.request({
          url: 'patrimony',
          method: 'put',
          body: { patrimony: data },
        });

        if (statusCode === 204) {
          addToast({
            title: 'Sucesso',
            type: 'success',
            message: 'Patrimônio atualizado!',
          });

          getPatrimonyList();
        } else {
          addToast({
            title: 'Erro',
            type: 'error',
            message: 'Erro ao editar patrimônio',
          });
        }
      } catch (error) {
        addToast({
          title: 'Erro',
          type: 'error',
          message: 'Erro ao excluir patrimônio',
        });
      }
    },
    [getPatrimonyList, addToast],
  );

  const createUser = useCallback(
    async (data: IUser) => {
      const httpClient = new AxiosHttpClient();

      try {
        const { statusCode, body } = await httpClient.request({
          url: 'users/create',
          method: 'post',
          body: data,
        });

        if (statusCode === 204) {
          addToast({
            title: 'Sucesso',
            type: 'success',
            message: 'Usuário cadastrado!',
          });
        }
        if (statusCode === 400) {
          addToast({
            title: 'Erro',
            type: 'error',
            message: body.error,
          });
        }
      } catch (error) {
        addToast({
          title: 'Erro',
          type: 'error',
          message: 'Erro ao cadastrar usuário',
        });
      }
    },
    [addToast],
  );

  return (
    <PatrimonyContextData.Provider
      value={{
        patrimonyList,
        getPatrimonyList,
        registerPatrimony,
        getPatrimonyByCode,
        deletePatrimony,
        getStatementList,
        statementList,
        getPatrimonyListByPage,
        createUser,
        patrimonyItem,
        updatePatrimony,
      }}
    >
      {children}
    </PatrimonyContextData.Provider>
  );
};

export function usePatrimony(): PatrimonyContext {
  const context = useContext(PatrimonyContextData);

  if (!context) {
    throw new Error('usePatrimony must be used within an PatrimonyProvider');
  }

  return context;
}

export default Patrimony;
