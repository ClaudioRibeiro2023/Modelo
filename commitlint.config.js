module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Tipos permitidos
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nova funcionalidade
        'fix',      // Correção de bug
        'docs',     // Documentação
        'style',    // Formatação (não afeta código)
        'refactor', // Refatoração
        'test',     // Testes
        'chore',    // Tarefas de manutenção
        'perf',     // Performance
        'ci',       // CI/CD
        'build',    // Build system
        'revert',   // Revert de commit
      ],
    ],
    // Escopo opcional mas deve ser lowercase se presente
    'scope-case': [2, 'always', 'lower-case'],
    // Subject deve começar com lowercase
    'subject-case': [2, 'always', 'lower-case'],
    // Subject não pode terminar com ponto
    'subject-full-stop': [2, 'never', '.'],
    // Header max 100 caracteres
    'header-max-length': [2, 'always', 100],
  },
}
