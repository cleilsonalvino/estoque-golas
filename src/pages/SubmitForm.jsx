import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Container, Card, Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { FaArrowDown, FaArrowUp, FaTshirt, FaImage } from 'react-icons/fa'; // -> Adicionei FaImage
import { GiRolledCloth } from "react-icons/gi";
import "./css/submit.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

// -> INÍCIO DA MUDANÇA
// Função para customizar a aparência de cada opção na lista do Select
const formatOptionLabel = ({ label, foto }) => (
  <div className="select-option-container">
    {foto ? (
      <img src={`https://api-drf-golas.cleilsonalvino.com.br${foto}`} alt="" className="select-option-image" />
    ) : (
      <div className="select-option-placeholder"><FaImage /></div>
    )}
    <span>{label}</span>
  </div>
);
// -> FIM DA MUDANÇA

function SubmitForm() {
  // ... (nenhuma mudança nos seus 'useState' e 'useEffect')
  const [codigoPolo, setCodigoPolo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [golaPunho, setGolaPunho] = useState("gola");
  const [polos, setPolos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", variant: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api-drf-golas.cleilsonalvino.com.br/trazer-dados")
      .then((response) => response.json())
      .then((data) => {
        setPolos(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar os polos:", error);
        setNotification({ show: true, message: "Erro ao carregar os polos. Tente novamente.", variant: "danger" });
        setIsLoading(false);
      });
  }, []);

  // -> INÍCIO DA MUDANÇA
  // Garante que a propriedade 'foto' esteja disponível em cada opção
  const poloOptions = polos.map(polo => ({
    value: polo.codigo,
    label: `${polo.codigo} - ${polo.cor}`,
    foto: polo.foto, // Passamos a URL da foto para ser usada na customização
  }));
  // -> FIM DA MUDANÇA

  const poloSelecionado = polos.find((polo) => polo.codigo === codigoPolo);

  const handleSubmit = async (e) => {
    // ... (nenhuma mudança na função handleSubmit)
    e.preventDefault();
    if (!codigoPolo || !tipo || !golaPunho) {
      setNotification({ show: true, message: "Por favor, preencha todos os campos.", variant: "warning" });
      return;
    }
    if (quantidade <= 0) {
      setNotification({ show: true, message: "A quantidade deve ser maior que zero.", variant: "warning" });
      return;
    }

    setIsSubmitting(true);
    setNotification({ show: false, message: "", variant: "" });

    try {
      const response = await fetch("https://api-drf-golas.cleilsonalvino.com.br/estoque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigoPolo, quantidade, tipo, golaPunho }),
      });
      const result = await response.json();
      if (result.success) {
        setNotification({ show: true, message: "Operação registrada com sucesso!", variant: "success" });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setNotification({ show: true, message: result.message || "Erro ao registrar a operação.", variant: "danger" });
      }
    } catch (error) {
      setNotification({ show: true, message: "Erro de conexão. Tente novamente.", variant: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-page">
      <NavBar />
      <Container className="submit-container">
        <Card className="submit-card">
          <Card.Header>
            <Card.Title>Registrar Movimentação de Estoque</Card.Title>
          </Card.Header>
          <Card.Body>
            {notification.show && (
              <Alert variant={notification.variant} onClose={() => setNotification({ show: false })} dismissible>
                {notification.message}
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="form-group">
                <Form.Label>Selecione o Polo</Form.Label>
                <Select
                  options={poloOptions}
                  isLoading={isLoading}
                  placeholder="Digite para buscar um código ou cor..."
                  onChange={(option) => setCodigoPolo(option ? option.value : "")} // Adicionado verificação para 'limpar'
                  isClearable
                  noOptionsMessage={() => "Nenhum polo encontrado"}
                  // -> INÍCIO DA MUDANÇA
                  // Aqui aplicamos nossa função de customização
                  formatOptionLabel={formatOptionLabel}
                  // -> FIM DA MUDANÇA
                />
              </Form.Group>
              
              {/* O resto do seu JSX permanece o mesmo */}
              <div className={`polo-info-panel ${!poloSelecionado && 'hidden'}`}>
                {poloSelecionado && (
                  <>
                    <img src={`https://api-drf-golas.cleilsonalvino.com.br${poloSelecionado.foto}`} alt={poloSelecionado.cor} />
                    <div className="polo-stock-details">
                      <h5>{poloSelecionado.cor}</h5>
                      <Row>
                        <Col className="stock-item">Gola: <strong>{poloSelecionado.gola.quantidade}</strong></Col>
                        <Col className="stock-item">Punho: <strong>{poloSelecionado.punho.quantidade}</strong></Col>
                      </Row>
                    </div>
                  </>
                )}
              </div>

              <Row className="mt-4">
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label>Tipo de Movimentação</Form.Label>
                    <div className="segmented-control">
                      <Button onClick={() => setTipo('entrada')} className={tipo === 'entrada' ? 'active' : ''}><FaArrowDown /> Entrada</Button>
                      <Button onClick={() => setTipo('saida')} className={tipo === 'saida' ? 'active' : ''}><FaArrowUp /> Saída</Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                   <Form.Group className="form-group">
                    <Form.Label>Item</Form.Label>
                    <div className="segmented-control">
                      <Button onClick={() => setGolaPunho('gola')} className={golaPunho === 'gola' ? 'active' : ''}><FaTshirt /> Gola</Button>
                      <Button onClick={() => setGolaPunho('punho')} className={golaPunho === 'punho' ? 'active' : ''}><GiRolledCloth /> Punho</Button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="form-group">
                <Form.Label htmlFor="quantidade">Quantidade</Form.Label>
                <Form.Control
                  type="number"
                  id="quantidade"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  min="1"
                  placeholder="0"
                  required
                />
              </Form.Group>

              <div className="d-grid mt-4">
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      {" "}Registrando...
                    </>
                  ) : "Registrar Movimentação"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}

export default SubmitForm;