import { FormEvent, useState } from "react";
import { FiPlus } from "react-icons/fi";
import api from "../services/api";
import './upload.css';

import Logo from '../assets/logo.png';

interface PrimeiroRetorno {
  executeProcesses: string;
  Code: number;
  Description: string;
}

interface GetProcess {
  FaceMatch: number;
  Id: string;
  Liveness: number;
  OCRCode: number;
  Score: number;
  Status: number;
}

export default function Upload() {
  const [name, setName] = useState<string>('')
  const [cpf, setCpf] = useState<string>('')
  const [selfie, setSelfie] = useState<File>()
  const [fotoRg, setFotoRg] = useState<File>()
  const [previewSelfie, setPreviewSelfie] = useState<any>("")
  const [previewFotoRg, setPreviewFotoRg] = useState<any>("")
  const [base64Selfie, setBase64Selfie] = useState<string>();
  const [base64Rg, setBase64Rg] = useState<string>();
  const [retorno, setRetorno] = useState<PrimeiroRetorno>();
  const [getProcess, setGetProcess] = useState<GetProcess>();

  //Esconder elementos
  const[showRetorno, setShowRetorno] = useState(false);
  const showOrHide = () => setShowRetorno(true);
  const[showForm, setShowForm] = useState(false);
  const showOrHideForm = () => setShowForm(true);
  const [loading, setloading] = useState(false);
  const [completed, setcompleted] = useState(false);

  const handleSelectImagesSelfie = (e: any) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    if (reader !== undefined && file !== undefined) {
      reader.onloadend = () => {
        setSelfie(file)
        setPreviewSelfie(reader.result)
      }
      reader.readAsDataURL(file);
    }
    if(file){
      reader.onload = _handleReaderLoadedSelfie
    }
  }

  const handleSelectImagesRg = (e: any) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    if (reader !== undefined && file !== undefined) {
      reader.onloadend = () => {
        setFotoRg(file)
        setPreviewFotoRg(reader.result)
      }
      reader.readAsDataURL(file);
    }
    if(file){
      reader.onload = _handleReaderLoadedRg
    }
  }

  const _handleReaderLoadedSelfie = (readerEvt: any) => {
    const binaryString = readerEvt.target.result;
    setBase64Selfie(binaryString)
    //setBase64(btoa(binaryString))
  }

  const _handleReaderLoadedRg = (readerEvt: any) => {
    const binaryString = readerEvt.target.result;
    setBase64Rg(binaryString)
    //setBase64(btoa(binaryString))
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();    
    const payload = {
      selfie: base64Selfie,
      rg: base64Rg,
      code: cpf,
      name: name
    }
    setTimeout(async() => {
      try{
        const {data} = await api.post('/unicoPROD/imagemReact', payload)
      setRetorno(data);
      setloading(true);

      setTimeout(() => {
        setcompleted(true);
      }, 1000);
      }catch(e){
        console.log(e);
      } 
    }, 2000);
  }

  async function solicitarScore (event:any){
    event.preventDefault(); 
    try{
      const {data} = await api.post('/unicoPROD/getProcess', retorno)
      setGetProcess(data.getProcesses);
    }catch(e){
      console.log(e);
    } 
  }

  const remove = () => {
    setName("")
    setCpf("")
    setSelfie(undefined)
    setFotoRg(undefined)
    setPreviewSelfie("")
    setPreviewFotoRg("")
    setBase64Selfie(undefined)
    setBase64Rg(undefined)
    setRetorno(undefined)
    setGetProcess(undefined)
    setShowRetorno(false)
    setShowForm(false)
    setloading(false)
    setcompleted(false)
  }

    
  return (
    <main>
      <form className="container" onSubmit={handleSubmit}>
      <img src={Logo} alt="Bem Promotora" /> 
        <label htmlFor="name">Nome</label>
        <div className="input-block">
          <input id="name" 
            value={name} 
            onChange={event => setName(event.target.value)} 
          />
        </div>

        <label htmlFor="cpf">CPF</label>
        <div className="input-block">
          <input id="cpf" 
            value={cpf} 
            onChange={event => setCpf(event.target.value)} 
          />
        </div>

        <div className="input-block">
          <div className="images-container">            
          <label htmlFor="images">Insira a Selfie: </label>
          {previewSelfie === "" ?
            <label htmlFor="selfie" className="new-image">
              <FiPlus size={24} color="#4264CE" /> 
            </label> :
              <img src={previewSelfie} alt="Bem Promotora" /> 
            }
            <input onChange={handleSelectImagesSelfie} type="file" id="selfie"/>
          </div>
          <div className="images-container">
            <label htmlFor="images">Insira a foto do RG: </label>
            {previewFotoRg === "" ?
            <label htmlFor="rg" className="new-image">
              <FiPlus size={24} color="#4264CE" /> 
            </label> :
              <img src={previewFotoRg} alt="Bem Promotora" /> 
            }
            <input multiple onChange={handleSelectImagesRg} type="file" id="rg"/>
          </div>
        </div>
        <button className="confirm-button" type="submit" onClick={showOrHideForm} >
          Enviar
        </button>
        
      </form>
      {showForm ?
        <form className="container" onSubmit={solicitarScore}>
          <div className="retorno-container">
          <>
            {!completed ? (
              <>
                {!loading ? (
                  <div className="spinner">
                    <span>Loading...</span>
                    <div className="half-spinner"></div>
                  </div>
                ) : (
                  <div className="completed">&#x2713;</div>
                )}
              </>
            ) : (
              <>
                <h3>RESULTADO DA CONSULTA: </h3>
                { showRetorno ?
                  <div>
                    <p>FaceMatch: {getProcess?.FaceMatch}</p>
                    <p>Id: {getProcess?.Id}</p>
                    <p>Liveness: {getProcess?.Liveness}</p>
                    <p>OCRCode: {getProcess?.OCRCode}</p>
                    <p>Score: {getProcess?.Score}</p>
                    <p>Status: {getProcess?.Status}</p> 
                  </div> :
                  <div> 
                    {retorno?.executeProcesses}         
                    {retorno?.Code}
                    {retorno?.Description}
                  </div> 
                }
              </>
            )}
          </>

           
         </div>
        {retorno?.executeProcesses != undefined ? 
          <button className="solicita-button" type="submit" onClick={showOrHide}>
            Solicitar Score
          </button>
        : null}
         
       </form> : null
      }
     
      <div className="container">
        <button className="clear-button" type="submit" onClick={remove}>
          Limpar informações
        </button>
      </div>
    </main>
  );
}