// Grade exemplo: Engenharia Ambiental (matriz com 10 semestres)
export const TOTAL_H = 3885;
export const SEM_H = [375, 420, 375, 420, 360, 360, 420, 330, 195, 180];
export const SEM_LABELS = ['1º Semestre', '2º Semestre', '3º Semestre', '4º Semestre', '5º Semestre', '6º Semestre', '7º Semestre', '8º Semestre', '9º Semestre', '10º Semestre'];

/** @typedef {{ id: string, sem: number, nome: string, tipo: string, h: number, pre: string[] }} Disciplina */

/** @type {Disciplina[]} */
export const DISCS = [
  /* 1 */ { id: 'ad01', sem: 1, nome: 'Álgebra Vetorial e Geometria Analítica', tipo: 'NB', h: 60, pre: [] },
	  { id: 'ad02', sem: 1, nome: 'Biologia Geral', tipo: 'NB', h: 60, pre: [] },
	  { id: 'ad03', sem: 1, nome: 'Cálculo I',   tipo: 'NB', h: 60, pre: [] },
	  { id: 'ad04', sem: 1, nome: 'Introdução à Engenharia Ambiental', tipo: 'NP', h: 30, pre: [] },
	  { id: 'ad05', sem: 1, nome: 'Introdução ao Estudo de Ética Ambiental', tipo: 'NB', h: 30, pre: [] },
	  { id: 'ad06', sem: 1, nome: 'Leitura e Produção de Gêneros Acadêmicos', tipo: 'NB', h: 45, pre: [] },
	  { id: 'ad07', sem: 1, nome: 'Metodólogia de Pesquisa Científica', tipo: 'NB', h: 30, pre: [] },
	  { id: 'ad08', sem: 1, nome: 'Química Geral', tipo: 'NB', h: 60, pre: [] },

  /* 2 */ { id: 'ad09', sem: 2, nome: 'Álgebra Linear', tipo: 'NB', h: 60, pre: ['ad01'] },
	  { id: 'ad10', sem: 2, nome: 'Cálculo II', tipo: 'NB', h: 60, pre: ['ad03'] },
	  { id: 'ad11', sem: 2, nome: 'Ecologia Aplicada', tipo: 'NP', h: 60, pre: ['ad02'] },
	  { id: 'ad12', sem: 2, nome: 'Educação Ambiental', tipo: 'NE', h: 60, pre: ['ad05'] },
	  { id: 'ad13', sem: 2, nome: 'Expressões Gráficas', tipo: 'NB', h: 60, pre: [ ] },
	  { id: 'ad14', sem: 2, nome: 'Física I', tipo: 'NB', h: 60, pre: [ ] },
	  { id: 'ad15', sem: 2, nome: 'Química Analítica', tipo: 'NP', h: 60, pre: ['ad08'] },
	  { id: 'ad16', sem: 2, nome: 'ACEX I', tipo: 'NB', h: 75, pre: [] },	

  /* 3 */ { id: 'ad17', sem: 3, nome: 'Cálculo III', tipo: 'NB', h: 60, pre: ['ad10'] },
	  { id: 'ad18', sem: 3, nome: 'Economia', tipo: 'NB', h: 45, pre: [ ] },
	  { id: 'ad19', sem: 3, nome: 'Física Experimental I', tipo: 'NB', h: 60, pre: ['ad14'] },
	  { id: 'ad20', sem: 3, nome: 'Física II', tipo: 'NB', h: 60, pre: ['ad14', 'ad03'] },
	  { id: 'ad21', sem: 3, nome: 'Higiene e Segurança do Trabalho', tipo: 'NB', h: 45, pre: [ ] },
	  { id: 'ad22', sem: 3, nome: 'Mêcanica dos Sólidos', tipo: 'NB', h: 60, pre: ['ad14'] },
	  { id: 'ad23', sem: 3, nome: 'Meteorologia e Climatologia', tipo: 'NP', h: 60, pre: [ ] },

  /* 4 */ { id: 'ad24', sem: 4, nome: 'Equações Diferenciais Ordinárias', tipo: 'NB', h: 60, pre: ['ad09','ad10'] },
	  { id: 'ad25', sem: 4, nome: 'Física III', tipo: 'NB', h: 60, pre: ['ad20','ad10'] },
	  { id: 'ad26', sem: 4, nome: 'Geologia', tipo: 'NP', h: 60, pre: [ ] },
	  { id: 'ad27', sem: 4, nome: 'Introdução à Ciência dos Materiais', tipo: 'NB', h: 60, pre: [ ] },
	  { id: 'ad28', sem: 4, nome: 'Introdução à Programação', tipo: 'NB', h: 60, pre: [] },
	  { id: 'ad29', sem: 4, nome: 'Microbiologia Sanitária e Ambiental', tipo: 'NP', h: 60, pre: ['ad02'] },
	  { id: 'ad30', sem: 4, nome: 'Probabilidade e Estatística', tipo: 'NB', h: 60, pre: ['ad10'] },
	  { id: 'ad31', sem: 4, nome: 'ACEX II', tipo: 'ATC', h: 60, pre: ['ad16'] },

  /* 5 */ { id: 'ad32', sem: 5, nome: 'Administração', tipo: 'NB', h: 30, pre: [ ] },
	  { id: 'ad33', sem: 5, nome: 'Cálculo Numérico', tipo: 'NB', h: 60, pre: ['ad24', 'ad28'] },
	  { id: 'ad34', sem: 5, nome: 'Desenho Auxiliado por Computador', tipo: 'NB', h: 45, pre: ['ad28'] },
	  { id: 'ad35', sem: 5, nome: 'Fenômentos de Transporte', tipo: 'NB', h: 60, pre: ['ad24','ad20'] },
	  { id: 'ad36', sem: 5, nome: 'Geoprocessamento', tipo: 'NP', h: 60, pre: ['ad28'] },
	  { id: 'ad37', sem: 5, nome: 'Poluição do Solo', tipo: 'NP', h: 60, pre: ['ad26'] },
	  { id: 'ad38', sem: 5, nome: 'Resistência dos Materiais I', tipo: 'NB', h: 45, pre: ['ad22'] },

  /* 6 */ { id: 'ad39', sem: 6, nome: 'Estabilidade das Construções', tipo: 'NP', h: 60, pre: ['ad38'] },
	  { id: 'ad40', sem: 6, nome: 'Estrutura de Concreto Armado', tipo: 'NP', h: 60, pre: ['ad38'] },
	  { id: 'ad41', sem: 6, nome: 'Hidráulica', tipo: 'NP', h: 60, pre: ['ad35'] },
	  { id: 'ad42', sem: 6, nome: 'Legislação e Direito Ambiental', tipo: 'NB', h: 45, pre: [] },
	  { id: 'ad43', sem: 6, nome: 'Reatores Bioquímicos', tipo: 'NE', h: 45, pre: ['ad35','ad29'] },
	  { id: 'ad44', sem: 6, nome: 'Sociologia', tipo: 'NB', h: 30, pre: [ ] },
	  { id: 'ad45', sem: 6, nome: 'Topografia', tipo: 'NP', h: 60, pre: ['ad34'] },
	  { id: 'ad46', sem: 6, nome: 'ACEX III', tipo: 'ATC', h: 75, pre: ['ad31'] },

  /* 7 */ { id: 'ad47', sem: 7, nome: 'Análise e Avaliação de Impactos Ambientais', tipo: 'NE', h: 60, pre: ['ad42'] },
	  { id: 'ad48', sem: 7, nome: 'Gestão e Planejamento Ambiental', tipo: 'NP', h: 60, pre: ['ad42'] },
	  { id: 'ad49', sem: 7, nome: 'Hidrologia Geral', tipo: 'NP', h: 60, pre: ['ad41'] },
	  { id: 'ad50', sem: 7, nome: 'Obras Hidráulicas', tipo: 'NP', h: 60, pre: ['ad41'] },
	  { id: 'ad51', sem: 7, nome: 'Operações Unitárias', tipo: 'NP', h: 60, pre: ['ad41'] },
	  { id: 'ad52', sem: 7, nome: 'Qualidade da Água', tipo: 'NE', h: 60, pre: ['ad29','ad15'] },
	  { id: 'ad53', sem: 7, nome: 'Sistemas Urbanos de Esgoto', tipo: 'NE', h: 60, pre: ['ad43','ad41'] },
	  { id: 'ad54', sem: 7, nome: 'ACEX IV', tipo: 'ATC', h: 75, pre: ['ad46'] },

  /* 8 */ { id: 'ad55', sem: 8, nome: 'Auditoria e Perícia Ambiental', tipo: 'NE', h: 60, pre: ['ad47','ad48'] },
	  { id: 'ad56', sem: 8, nome: 'Gestão Integrada de Bacia Hidrográficas', tipo: 'NE', h: 45, pre: ['ad49'] },
	  { id: 'ad57', sem: 8, nome: 'Optativa I', tipo: 'NE', h: 60, pre: [ ] },
	  { id: 'ad58', sem: 8, nome: 'Recuperação de Áreas Degradadas', tipo: 'NE', h: 60, pre: ['ad47','ad37'] },
	  { id: 'ad59', sem: 8, nome: 'Poluição Atmosférica', tipo: 'NE', h: 45, pre: ['ad22','ad23'] },
	  { id: 'ad60', sem: 8, nome: 'Tratamento de Efluentes', tipo: 'NE', h: 60, pre: ['ad53','ad29'] },
	  { id: 'ad61', sem: 8, nome: 'ACEX V', tipo: 'ATC', h: 90, pre: ['ad54'] },

  /* 9 */ { id: 'ad62', sem: 9, nome: 'Gestão e Tratamento de Resíduos Sólidos', tipo: 'NE', h: 60, pre: ['ad60'] },
	  { id: 'ad63', sem: 9, nome: 'Optativa II', tipo: 'OPT', h: 60, pre: [ ] },
	  { id: 'ad64', sem: 9, nome: 'TCC I', tipo: 'TCC', h: 30, pre: [ ] },
	  { id: 'ad65', sem: 9, nome: 'Tratamento e Abastecimento de Água', tipo: 'NE', h: 60, pre: ['ad15'] },

  /* 10 */ { id: 'ad66', sem: 10, nome: 'Estágio Supervisionado', tipo: 'ATC', h: 165, pre: ['ad60'] },
	  { id: 'ad67', sem: 10, nome: 'TCC II', tipo: 'TCC', h: 30, pre: [ ] },
];
