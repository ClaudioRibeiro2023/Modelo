#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires, no-console */
/**
 * Script para validar variáveis de ambiente
 * 
 * Uso: node scripts/check-env.js [--strict]
 */

const fs = require('fs')
const path = require('path')

// Configuração de variáveis por ambiente
const ENV_CONFIG = {
  'apps/web': {
    file: 'apps/web/.env',
    example: 'apps/web/.env.example',
    required: [
      'VITE_API_URL',
      'VITE_KEYCLOAK_URL',
      'VITE_KEYCLOAK_REALM',
      'VITE_KEYCLOAK_CLIENT_ID',
    ],
    optional: [
      'VITE_DEMO_MODE',
      'VITE_APP_TITLE',
    ],
  },
  'api-template': {
    file: 'api-template/.env',
    example: 'api-template/.env.example',
    required: [
      'DATABASE_URL',
      'SECRET_KEY',
    ],
    optional: [
      'REDIS_URL',
      'KEYCLOAK_URL',
      'KEYCLOAK_REALM',
      'LOG_LEVEL',
      'LOG_FORMAT',
      'ENVIRONMENT',
    ],
  },
  'infra': {
    file: 'infra/.env',
    example: 'infra/.env.example',
    required: [
      'POSTGRES_USER',
      'POSTGRES_PASSWORD',
      'POSTGRES_DB',
    ],
    optional: [
      'REDIS_PASSWORD',
      'KEYCLOAK_ADMIN',
      'KEYCLOAK_ADMIN_PASSWORD',
    ],
  },
}

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null
  }
  
  const content = fs.readFileSync(filePath, 'utf-8')
  const vars = {}
  
  content.split('\n').forEach(line => {
    // Ignorar comentários e linhas vazias
    if (!line || line.startsWith('#')) return
    
    const [key, ...valueParts] = line.split('=')
    if (key) {
      vars[key.trim()] = valueParts.join('=').trim()
    }
  })
  
  return vars
}

function checkEnv(config, name) {
  const results = {
    name,
    exists: false,
    hasExample: false,
    missing: [],
    empty: [],
    optional: [],
    warnings: [],
  }
  
  const envPath = path.join(process.cwd(), config.file)
  const examplePath = path.join(process.cwd(), config.example)
  
  // Verificar se .env.example existe
  results.hasExample = fs.existsSync(examplePath)
  
  // Verificar se .env existe
  const envVars = parseEnvFile(envPath)
  
  if (!envVars) {
    results.exists = false
    results.missing = config.required
    return results
  }
  
  results.exists = true
  
  // Verificar variáveis obrigatórias
  for (const varName of config.required) {
    if (!(varName in envVars)) {
      results.missing.push(varName)
    } else if (!envVars[varName]) {
      results.empty.push(varName)
    }
  }
  
  // Verificar variáveis opcionais
  for (const varName of config.optional) {
    if (!(varName in envVars)) {
      results.optional.push(varName)
    }
  }
  
  return results
}

function printResults(results, strict) {
  let hasErrors = false
  
  console.log('\n🔍 Verificação de Variáveis de Ambiente\n')
  console.log('─'.repeat(50))
  
  for (const result of results) {
    const icon = result.exists ? '📁' : '❌'
    console.log(`\n${icon} ${result.name}`)
    
    if (!result.exists) {
      console.log(`   ⚠️  Arquivo .env não encontrado: ${result.name}/.env`)
      if (result.hasExample) {
        console.log(`   💡 Execute: cp ${result.name}/.env.example ${result.name}/.env`)
      }
      hasErrors = true
      continue
    }
    
    if (result.missing.length > 0) {
      console.log(`   ❌ Variáveis FALTANDO (obrigatórias):`)
      result.missing.forEach(v => console.log(`      - ${v}`))
      hasErrors = true
    }
    
    if (result.empty.length > 0) {
      console.log(`   ⚠️  Variáveis VAZIAS (obrigatórias):`)
      result.empty.forEach(v => console.log(`      - ${v}`))
      if (strict) hasErrors = true
    }
    
    if (result.optional.length > 0) {
      console.log(`   ℹ️  Variáveis opcionais não configuradas:`)
      result.optional.forEach(v => console.log(`      - ${v}`))
    }
    
    if (result.missing.length === 0 && result.empty.length === 0) {
      console.log(`   ✅ Todas as variáveis obrigatórias configuradas`)
    }
  }
  
  console.log('\n' + '─'.repeat(50))
  
  if (hasErrors) {
    console.log('\n❌ Verificação FALHOU - Corrija os problemas acima\n')
    process.exit(1)
  } else {
    console.log('\n✅ Verificação OK - Ambiente configurado corretamente\n')
    process.exit(0)
  }
}

function main() {
  const strict = process.argv.includes('--strict')
  
  if (strict) {
    console.log('🔒 Modo STRICT ativado - variáveis vazias serão tratadas como erro')
  }
  
  const results = Object.entries(ENV_CONFIG).map(([name, config]) => 
    checkEnv(config, name)
  )
  
  printResults(results, strict)
}

main()
