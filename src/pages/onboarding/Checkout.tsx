import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, CreditCard, Check, Trash2, X, Shield, Clock } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";

// Tipos
interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay';
  identifier: string;
  lastFour?: string;
  expiresAt?: string;
  isDefault: boolean;
  createdAt: Date;
  lastUsedAt?: Date;
}

// Ícones dos métodos
const methodIcons: Record<string, React.ReactNode> = {
  card: <CreditCard size={24} className="text-gray-700" />,
  paypal: <span className="text-[20px] font-bold text-blue-600">P</span>,
  apple_pay: <span className="text-[22px]">🍎</span>,
};

const methodLabels: Record<string, string> = {
  card: "Cartão de Crédito",
  paypal: "PayPal",
  apple_pay: "Apple Pay",
};

export default function Checkout() {
  const navigate = useNavigate();
  const { completeOnboarding } = useOnboarding();
  
  // Estados
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'card' | 'paypal' | 'apple_pay' | null>(null);
  
  // Form states para cartão
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardName, setCardName] = useState("");

  const hasPaymentMethod = paymentMethods.length > 0;

  // Formatar número do cartão
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(" ").substring(0, 19) : "";
  };

  // Formatar validade
  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + "/" + numbers.substring(2, 4);
    }
    return numbers;
  };

  // Adicionar método de pagamento (mock)
  const handleAddMethod = () => {
    if (!selectedType) return;

    let newMethod: PaymentMethod;

    if (selectedType === 'card') {
      if (!cardNumber || !cardExpiry || !cardName) return;
      const lastFour = cardNumber.replace(/\s/g, "").slice(-4);
      newMethod = {
        id: `card_${Date.now()}`,
        type: 'card',
        identifier: `Visa •••• ${lastFour}`,
        lastFour,
        expiresAt: cardExpiry,
        isDefault: paymentMethods.length === 0,
        createdAt: new Date(),
      };
    } else if (selectedType === 'paypal') {
      newMethod = {
        id: `paypal_${Date.now()}`,
        type: 'paypal',
        identifier: 'PayPal conectado',
        isDefault: paymentMethods.length === 0,
        createdAt: new Date(),
      };
    } else {
      newMethod = {
        id: `apple_${Date.now()}`,
        type: 'apple_pay',
        identifier: 'Apple Pay configurado',
        isDefault: paymentMethods.length === 0,
        createdAt: new Date(),
      };
    }

    setPaymentMethods([...paymentMethods, newMethod]);
    setSelectedPaymentMethodId(newMethod.id);
    setShowAddModal(false);
    setSelectedType(null);
    setCardNumber("");
    setCardExpiry("");
    setCardName("");
  };

  // Remover método
  const handleRemoveMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(m => m.id !== id));
    if (selectedPaymentMethodId === id) {
      setSelectedPaymentMethodId(null);
    }
  };

  // Selecionar método
  const handleSelectMethod = (id: string) => {
    setSelectedPaymentMethodId(id);
  };

  // Continuar para pagamento (mock)
  const handleContinueToPayment = () => {
    console.log("🚀 Gateway de pagamento será implementado futuramente");
    console.log("📋 Método selecionado:", selectedPaymentMethodId);
    
    // Simular conclusão do onboarding
    completeOnboarding();
    navigate('/app/home', { replace: true });
  };

  return (
    <div className="min-h-[100svh] bg-[#f9f9f9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[18px] font-bold text-gray-900">Método de Pagamento</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Estado Vazio */}
        {!hasPaymentMethod && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <CreditCard size={36} className="text-gray-400" />
            </div>
            <h2 className="text-[18px] font-bold text-gray-900 mb-2">
              Nenhum método cadastrado
            </h2>
            <p className="text-[14px] text-gray-500 mb-8 px-4">
              Você ainda não possui um método de pagamento cadastrado.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-4 bg-[#1a1a1a] text-white rounded-2xl font-bold"
            >
              <Plus size={20} />
              Adicionar método
            </button>
          </div>
        )}

        {/* Lista de Métodos */}
        {hasPaymentMethod && (
          <>
            <section className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-bold text-gray-900">Seus métodos</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1 text-[14px] font-semibold text-[#22c55e]"
                >
                  <Plus size={18} />
                  Adicionar
                </button>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => handleSelectMethod(method.id)}
                    className={`bg-white rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all border-2 ${
                      selectedPaymentMethodId === method.id
                        ? 'border-[#22c55e] shadow-md'
                        : 'border-transparent shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                        {methodIcons[method.type]}
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-gray-900">{method.identifier}</p>
                        {method.expiresAt && (
                          <p className="text-[13px] text-gray-400">Venc. {method.expiresAt}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {selectedPaymentMethodId === method.id && (
                        <div className="w-6 h-6 bg-[#22c55e] rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveMethod(method.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Mensagens de Confiança */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <Clock size={20} className="text-[#22c55e] flex-shrink-0" />
                <p className="text-[13px] text-gray-700">
                  Você só será cobrado após o período de teste.
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <Shield size={20} className="text-blue-500 flex-shrink-0" />
                <p className="text-[13px] text-gray-700">
                  Você pode cancelar a qualquer momento.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Botão Continuar */}
      {hasPaymentMethod && (
        <div className="px-6 pb-10 pt-4 bg-white border-t border-gray-100">
          <button
            onClick={handleContinueToPayment}
            disabled={!selectedPaymentMethodId}
            className={`w-full py-5 px-8 text-white text-[18px] font-bold rounded-[20px] transition-all duration-300 ${
              selectedPaymentMethodId
                ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a] active:scale-[0.98] shadow-xl'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Continuar para pagamento
          </button>
        </div>
      )}

      {/* Modal Adicionar Método */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-[32px] p-6 pb-10 animate-slide-up">
            {/* Header do Modal */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] font-bold text-gray-900">
                {selectedType ? methodLabels[selectedType] : 'Adicionar método'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedType(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Seleção de Tipo */}
            {!selectedType && (
              <div className="space-y-3">
                {(['card', 'paypal', 'apple_pay'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className="w-full bg-gray-50 rounded-2xl p-5 flex items-center gap-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      {methodIcons[type]}
                    </div>
                    <span className="text-[16px] font-semibold text-gray-900">
                      {methodLabels[type]}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Formulário Cartão */}
            {selectedType === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[13px] font-semibold text-gray-500 mb-2 block">
                    Número do cartão
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full p-4 bg-gray-50 rounded-xl text-[16px] border-2 border-transparent focus:border-[#22c55e] focus:outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] font-semibold text-gray-500 mb-2 block">
                      Validade
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full p-4 bg-gray-50 rounded-xl text-[16px] border-2 border-transparent focus:border-[#22c55e] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-gray-500 mb-2 block">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      className="w-full p-4 bg-gray-50 rounded-xl text-[16px] border-2 border-transparent focus:border-[#22c55e] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-gray-500 mb-2 block">
                    Nome no cartão
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="NOME COMPLETO"
                    className="w-full p-4 bg-gray-50 rounded-xl text-[16px] border-2 border-transparent focus:border-[#22c55e] focus:outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={handleAddMethod}
                  disabled={!cardNumber || !cardExpiry || !cardName}
                  className={`w-full py-4 px-8 text-white text-[16px] font-bold rounded-xl transition-all mt-4 ${
                    cardNumber && cardExpiry && cardName
                      ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Salvar cartão
                </button>
              </div>
            )}

            {/* PayPal / Apple Pay (simulado) */}
            {(selectedType === 'paypal' || selectedType === 'apple_pay') && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {methodIcons[selectedType]}
                </div>
                <p className="text-[14px] text-gray-500 mb-6">
                  Clique no botão abaixo para conectar sua conta {methodLabels[selectedType]}.
                </p>
                <button
                  onClick={handleAddMethod}
                  className="w-full py-4 px-8 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-[16px] font-bold rounded-xl transition-all"
                >
                  Conectar {methodLabels[selectedType]}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
