import { HttpResponse } from '../../../../infra/http/axios-http-client';

export enum PatrimonyStatus {
  Novo = 'Novo',
  Bom = 'Bom',
  Iservivel = 'Inservivel',
  Recuperavel = 'Recuperavel',
  Antieconomico = 'Antieconomico',
}

export interface PatrimonyItens {
  name: string;
  localization: string;
  observation: string;
}

export interface RegisterPatrimony {
  id?: string;
  code: string;
  description: string;
  state: string;
  entryDate: string;
  lastConferenceDate: string;
  value: string;
  patrimonyItens: Array<PatrimonyItens>;
}

export interface StatementList {
  id: string;
  code: string;
  responsibleName: string;
  siapeCode: string;
  emissionDate: string;
  patrimonies: [
    {
      id: string;
      code: string;
      description: string;
      state: string;
      entryDate: string;
      lastConferenceDate: string;
      value: string;
    },
  ];
}

export interface PatrimonyContext {
  patrimonyList: RegisterPatrimony[];
  getPatrimonyList: () => Promise<HttpResponse>;
  registerPatrimony: (data: RegisterPatrimony) => Promise<void>;
  getPatrimonyByCode: (code: string) => Promise<HttpResponse>;
  deletePatrimony: (id: string) => Promise<void>;
  getStatementList: () => Promise<HttpResponse>;
  statementList: StatementList[];
}

export const patrimonyStatusEnum = [
  PatrimonyStatus.Novo,
  PatrimonyStatus.Bom,
  PatrimonyStatus.Recuperavel,
  PatrimonyStatus.Antieconomico,
  PatrimonyStatus.Iservivel,
];
