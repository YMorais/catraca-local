let cpf = "";

function atualizarVisor(mensagem = "") {
  const visor = document.getElementById("visor");
  visor.textContent = mensagem || (cpf || "Digite seu CPF");
}

function adicionarDigito(digito) {
  if (cpf.length < 11) {
    cpf += digito;
    atualizarVisor();
  }
}

function apagarCPF() {
  cpf = cpf.slice(0, -1);
  atualizarVisor();
  atualizarStatus("");
}

async function enviarCPF() {
  const visor = document.getElementById("visor");

  if (cpf.length !== 11) {
    visor.textContent = "CPF incompleto";
    atualizarStatus("erro");
    return;
  }
  try{
      const dados = await fetch('https://backend-catraca.vercel.app/academia/aluno/'+cpf)
      console.log(dados)
      const aluno = await dados.json()
      console.log("Aluno:"+aluno)
      if (aluno.status == "Ativo"){
        visor.textContent = `Olá ${aluno.nome}. Acesso liberado`
      }else if(aluno.status=="Inativo"){
        visor.textContent = "CPF não encontrado"
      }else{
        visor.textContent = `Acesso negado, ${aluno.nome}. Procure a secretaria`
      }

  }catch(error){
    console.log(error)
  }


  // Reseta após 3 segundos
  setTimeout(() => {
    cpf = "";
    atualizarVisor();
    atualizarStatus("");
  }, 3000);
}

function atualizarStatus(status) {
  const circulo = document.getElementById("statusCirculo");

  if (status === "liberado") {
    circulo.className = "absolute -right-10 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full border-4 border-green-500 bg-green-400";
  } else if (status === "bloqueado" || status === "erro") {
    circulo.className = "absolute -right-10 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full border-4 border-red-500 bg-red-400";
  } else {
    circulo.className = "absolute -right-10 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full border-4 border-gray-300 bg-gray-200";
  }
}

document.addEventListener("keydown", function (event) {
  const tecla = event.key;

  if (tecla >= "0" && tecla <= "9") {
    adicionarDigito(tecla);
  } else if (tecla === "Backspace") {
    apagarCPF();
  } else if (tecla === "Enter") {
    enviarCPF();
  }
});
