// Atividade 1 - Calendário de feriados com a BrasilAPI
// Aluno(a): ________________________

const campoAno = document.getElementById('ano')
const tabela = document.getElementById('tabelaFeriados')
const mensagem = document.getElementById('mensagem')
const total = document.getElementById('total')
const proximo = document.getElementById('proximo')

const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

campoAno.value = new Date().getFullYear()

function consultarFeriados() {
    const ano = campoAno.value
    tabela.innerHTML = ''
    mensagem.innerHTML = ''
    mensagem.className = ''
    total.innerHTML = ''
    proximo.innerHTML = ''

    fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error('Não foi possível consultar os feriados.')
            }

            return resposta.json()
        })
        .then(feriados => {
            console.log(feriados)

            total.innerHTML = `Total de feriados: ${feriados.length}`

            const hoje = new Date()
            hoje.setHours(0, 0, 0, 0)
            let proximoFeriado = null
            let dataProximoFeriado = null

            feriados.forEach(feriado => {
                // Dica: o 'T12:00:00' evita erro de fuso horario
                const data = new Date(feriado.date + 'T12:00:00')
                const dataFormatada = data.toLocaleDateString('pt-BR')
                const diaDaSemana = diasDaSemana[data.getDay()]
                let classeLinha = ''

                if (data.getDay() === 0 || data.getDay() === 6) {
                    classeLinha = 'fim-de-semana'
                }

                tabela.innerHTML += `
                    <tr class="${classeLinha}">
                        <td>${dataFormatada}</td>
                        <td>${diaDaSemana}</td>
                        <td>${feriado.name}</td>
                    </tr>`

                if (data >= hoje && (dataProximoFeriado === null || data < dataProximoFeriado)) {
                    proximoFeriado = feriado
                    dataProximoFeriado = data
                }
            })

            if (proximoFeriado !== null) {
                const dataCalculo = new Date(dataProximoFeriado)
                dataCalculo.setHours(0, 0, 0, 0)
                const diferenca = dataCalculo - hoje
                const diasFaltando = Math.ceil(diferenca / (1000 * 60 * 60 * 24))
                const dataFormatada = dataProximoFeriado.toLocaleDateString('pt-BR')

                proximo.innerHTML = `Próximo feriado: ${proximoFeriado.name}, em ${dataFormatada}. Faltam ${diasFaltando} dia(s).`
            } else {
                proximo.innerHTML = 'Não há mais feriados no ano consultado.'
            }
        })
        .catch(erro => {
            mensagem.innerHTML = erro.message
            mensagem.className = 'erro'
            console.log(erro)
        })
}

document.getElementById('btnConsultar').addEventListener('click', consultarFeriados)
