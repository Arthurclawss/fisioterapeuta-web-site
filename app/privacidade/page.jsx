import Link from 'next/link';
import { contact } from '../data/site-content';

export const metadata = { title: 'Privacidade | Rudy Mollick' };

export default function PrivacyPage() {
  return <main className="privacy-page"><Link href="/" className="text-link">← Voltar ao site</Link><p className="small-eyebrow">RUDY MOLLICK · FISIOTERAPIA</p><h1>Política de<br /><em>privacidade.</em></h1><p>Atualizada em 12 de novembro de 2026.</p>
    <section><h2>Sobre esta página</h2><p>Esta página apresenta Rudy Mollick e seus canais de atendimento. Esta versão não possui formulário de cadastro, área de pacientes ou envio de informações clínicas pelo site.</p></section>
    <section><h2>Contato por serviços externos</h2><p>Links de Instagram, e-mail e WhatsApp levam a serviços externos, que possuem suas próprias práticas de privacidade. O WhatsApp exibido nesta prévia é demonstrativo e não envia mensagens a um número fictício.</p></section>
    <section><h2>Mapa e navegação</h2><p>O mapa do Google só é carregado quando você escolhe a opção “Carregar mapa do Google”. Ao ativá-lo ou abrir uma rota, o Google pode receber informações técnicas, como seu endereço IP e dados do navegador. A infraestrutura de hospedagem também pode registrar dados técnicos para entregar e proteger o site.</p></section>
    <section><h2>Depoimentos</h2><p>Os depoimentos desta prévia são fictícios e estão identificados como ilustrativos. Relatos reais devem substituir esses exemplos somente após autorização de uso das pessoas envolvidas.</p></section>
    <section><h2>Dúvidas sobre privacidade</h2><p>Para conversar sobre o uso de suas informações ou solicitar revisão de conteúdo, entre em contato em <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p></section>
  </main>;
}
