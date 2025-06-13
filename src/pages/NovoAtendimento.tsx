import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, AlertTriangle, Cake } from "lucide-react";
import { toast } from "sonner";
import useUserDataService from "@/services/userDataService";
import BirthdayNotifications from "@/components/BirthdayNotifications";

const NovoAtendimento = () => {
  const navigate = useNavigate();
  const { getAtendimentos, saveAtendimentos, checkBirthdays } = useUserDataService();
  const [dataNascimento, setDataNascimento] = useState("");
  const [signo, setSigno] = useState("");
  const [atencao, setAtencao] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    tipoServico: "",
    statusPagamento: "",
    dataAtendimento: "",
    valor: "",
    destino: "",
    ano: "",
    atencaoNota: "",
    detalhes: "",
    tratamento: "",
    indicacao: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSelectChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const checkIfBirthday = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    if (birth.getDate() === today.getDate() && birth.getMonth() === today.getMonth()) {
      const age = today.getFullYear() - birth.getFullYear();
      toast.success(
        `🎉 Hoje é aniversário desta pessoa! ${age} anos`,
        {
          duration: 8000,
          icon: <Cake className="h-5 w-5" />,
          description: "Não esqueça de parabenizar!"
        }
      );
    }
  };

  const handleDataNascimentoChange = (e) => {
    const value = e.target.value;
    setDataNascimento(value);
    setFormData({
      ...formData,
      dataNascimento: value,
    });
    
    // Check if it's birthday
    if (value) {
      checkIfBirthday(value);
    }
    
    // Lógica simples para determinar o signo baseado na data de nascimento
    if (value) {
      const date = new Date(value);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      let signoCalculado = "";
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) signoCalculado = "Áries";
      else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) signoCalculado = "Touro";
      else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) signoCalculado = "Gêmeos";
      else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) signoCalculado = "Câncer";
      else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) signoCalculado = "Leão";
      else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) signoCalculado = "Virgem";
      else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) signoCalculado = "Libra";
      else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) signoCalculado = "Escorpião";
      else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) signoCalculado = "Sagitário";
      else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) signoCalculado = "Capricórnio";
      else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) signoCalculado = "Aquário";
      else signoCalculado = "Peixes";
      
      setSigno(signoCalculado);
    } else {
      setSigno("");
    }
  };

  const handleSaveAtendimento = () => {
    // Get existing atendimentos from user data service
    const existingAtendimentos = getAtendimentos();
    
    const novoAtendimento = {
      id: Date.now().toString(),
      ...formData,
      signo,
      atencaoFlag: atencao,
      data: new Date().toISOString(),
    };
    
    // Add new atendimento to array
    existingAtendimentos.push(novoAtendimento);
    
    // Save back using user data service
    saveAtendimentos(existingAtendimentos);
    
    // Show success message
    toast.success("Atendimento salvo com sucesso!");
    
    // Navigate back to home page
    navigate("/");
  };
  
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pago":
        return "bg-green-500 text-white border-green-600";
      case "pendente":
        return "bg-yellow-500 text-white border-yellow-600";
      case "parcelado":
        return "bg-red-500 text-white border-red-600";
      default:
        return "bg-gray-200 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <BirthdayNotifications checkOnMount={false} />
      
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[#2196F3]">
            Novo Atendimento
          </h1>
        </div>

        <Card className="border-[#C5A3E0] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#2196F3]">Cadastro de Atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Cliente</Label>
                <Input 
                  id="nome" 
                  placeholder="Nome completo" 
                  value={formData.nome}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input 
                  id="dataNascimento" 
                  type="date" 
                  value={dataNascimento}
                  onChange={handleDataNascimentoChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signo">Signo</Label>
                <Input id="signo" value={signo} readOnly className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoServico">Tipo de Serviço</Label>
                <Select onValueChange={(value) => handleSelectChange("tipoServico", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tarot">Tarot</SelectItem>
                    <SelectItem value="terapia">Terapia</SelectItem>
                    <SelectItem value="mesa-radionica">Mesa Radiônica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataAtendimento">Data do Atendimento</Label>
                <Input 
                  id="dataAtendimento" 
                  type="date" 
                  value={formData.dataAtendimento}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor Cobrado (R$)</Label>
                <Input 
                  id="valor" 
                  type="number" 
                  placeholder="0.00" 
                  value={formData.valor}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusPagamento">Status de Pagamento</Label>
                <Select onValueChange={(value) => handleSelectChange("statusPagamento", value)}>
                  <SelectTrigger className={formData.statusPagamento ? `border-2 ${getStatusColor(formData.statusPagamento)}` : ""}>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pago" className="bg-green-100 text-green-800 hover:bg-green-200">Pago</SelectItem>
                    <SelectItem value="pendente" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</SelectItem>
                    <SelectItem value="parcelado" className="bg-red-100 text-red-800 hover:bg-red-200">Parcelado</SelectItem>
                  </SelectContent>
                </Select>
                
                {formData.statusPagamento && (
                  <div className={`mt-2 px-3 py-1 rounded-md text-sm flex items-center ${getStatusColor(formData.statusPagamento)}`}>
                    <span className={`h-3 w-3 rounded-full mr-2 ${
                      formData.statusPagamento === 'pago' ? 'bg-white' : 
                      formData.statusPagamento === 'pendente' ? 'bg-white' : 'bg-white'
                    }`}></span>
                    <span className="capitalize">{formData.statusPagamento}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="destino">Destino</Label>
                <Input 
                  id="destino" 
                  placeholder="Destino do cliente" 
                  value={formData.destino}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ano">Ano</Label>
                <Input 
                  id="ano" 
                  placeholder="Ano específico" 
                  value={formData.ano}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <div className="flex items-center justify-between">
                  <Label htmlFor="atencao" className="text-base flex items-center">
                    <AlertTriangle className={`mr-2 h-4 w-4 ${atencao ? "text-red-500" : "text-gray-400"}`} />
                    ATENÇÃO
                  </Label>
                  <Switch 
                    checked={atencao} 
                    onCheckedChange={setAtencao} 
                    className="data-[state=checked]:bg-red-500"
                  />
                </div>
                <Input 
                  id="atencaoNota" 
                  placeholder="Pontos de atenção" 
                  className={atencao ? "border-red-500 bg-red-50" : ""}
                  value={formData.atencaoNota}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="detalhes">Detalhes da Sessão</Label>
              <Textarea 
                id="detalhes" 
                placeholder="Revelações, conselhos e orientações..." 
                className="min-h-[120px]"
                value={formData.detalhes}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="tratamento">Tratamento</Label>
                <Textarea 
                  id="tratamento" 
                  placeholder="Observações sobre o tratamento..." 
                  className="min-h-[100px]"
                  value={formData.tratamento}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="indicacao">Indicação</Label>
                <Textarea 
                  id="indicacao" 
                  placeholder="Informações adicionais e indicações..." 
                  className="min-h-[100px]"
                  value={formData.indicacao}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-[#2196F3] hover:bg-[#1976D2]"
              onClick={handleSaveAtendimento}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Atendimento
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default NovoAtendimento;
