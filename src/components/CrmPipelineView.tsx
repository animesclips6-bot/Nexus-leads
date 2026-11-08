import React, { useState } from 'react';
import {
  Kanban,
  Table as TableIcon,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  MessageSquare,
  Sparkles,
  Phone,
  Globe,
  Clock,
  User,
  DollarSign,
  ChevronRight,
  Filter,
} from 'lucide-react';
import type { Lead, PipelineStage, TaskItem, NoteItem } from '../types/index.ts';

interface CrmPipelineViewProps {
  savedLeads: Lead[];
  onUpdateLead: (lead: Lead) => void;
  onRemoveLead: (leadId: string) => void;
  onOpenAnalysis: (lead: Lead) => void;
  onOpenWhatsApp: (lead: Lead) => void;
}

const STAGES: { id: PipelineStage; title: string; color: string; border: string }[] = [
  { id: 'new', title: 'Novos Leads', color: 'text-blue-400', border: 'border-blue-500/30' },
  { id: 'contacted', title: 'Contato Feito', color: 'text-amber-400', border: 'border-amber-500/30' },
  { id: 'negotiating', title: 'Em Negociação', color: 'text-purple-400', border: 'border-purple-500/30' },
  { id: 'proposal', title: 'Proposta Enviada', color: 'text-indigo-400', border: 'border-indigo-500/30' },
  { id: 'won', title: 'Fechado (Ganho)', color: 'text-emerald-400', border: 'border-emerald-500/30' },
  { id: 'lost', title: 'Perdido', color: 'text-rose-400', border: 'border-rose-500/30' },
];

export const CrmPipelineView: React.FC<CrmPipelineViewProps> = ({
  savedLeads,
  onUpdateLead,
  onRemoveLead,
  onOpenAnalysis,
  onOpenWhatsApp,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredLeads = savedLeads.filter((l) =>
    l.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.city.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleStageChange = (lead: Lead, newStage: PipelineStage) => {
    const updated: Lead = {
      ...lead,
      stage: newStage,
      notes: [
        {
          id: `note-${Date.now()}`,
          text: `Estágio alterado para "${STAGES.find((s) => s.id === newStage)?.title}"`,
          createdAt: new Date().toISOString(),
        },
        ...lead.notes,
      ],
    };
    onUpdateLead(updated);
    if (selectedLead?.id === lead.id) setSelectedLead(updated);
  };

  const handleAddNote = () => {
    if (!selectedLead || !newNoteText.trim()) return;
    const note: NoteItem = {
      id: `note-${Date.now()}`,
      text: newNoteText.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated: Lead = {
      ...selectedLead,
      notes: [note, ...selectedLead.notes],
    };
    onUpdateLead(updated);
    setSelectedLead(updated);
    setNewNoteText('');
  };

  const handleAddTask = () => {
    if (!selectedLead || !newTaskTitle.trim()) return;
    const task: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      dueDate: newTaskDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      completed: false,
      priority: 'medium',
    };
    const updated: Lead = {
      ...selectedLead,
      tasks: [...selectedLead.tasks, task],
    };
    onUpdateLead(updated);
    setSelectedLead(updated);
    setNewTaskTitle('');
    setNewTaskDate('');
  };

  const handleToggleTask = (taskId: string) => {
    if (!selectedLead) return;
    const updatedTasks = selectedLead.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const updated: Lead = { ...selectedLead, tasks: updatedTasks };
    onUpdateLead(updated);
    setSelectedLead(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0B0F19] p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Filtrar por nome, segmento ou cidade..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full sm:w-72 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <div className="text-xs text-slate-400 whitespace-nowrap">
            <strong className="text-slate-200 font-mono tabular-nums">{filteredLeads.length}</strong> de {savedLeads.length} leads
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
              viewMode === 'kanban'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Tabela</span>
          </button>
        </div>
      </div>

      {savedLeads.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-dashed border-slate-800 bg-[#0B0F19]/50">
          <Kanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Nenhum Lead Salvo no CRM</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            Pesquise empresas no Google Maps na aba &ldquo;Busca de Leads&rdquo; e clique em &ldquo;Salvar no CRM&rdquo; para gerenciar todo o seu funil de prospecção aqui.
          </p>
        </div>
      ) : viewMode === 'kanban' ? (
        /* Kanban Columns */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => (l.stage || 'new') === stage.id);
            return (
              <div
                key={stage.id}
                className="bg-[#090D17] border border-slate-800/80 rounded-xl p-3 flex flex-col min-h-[480px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${stage.color.replace('text-', 'bg-')}`} />
                    <h4 className="text-xs font-bold text-slate-200">{stage.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-3 rounded-lg border bg-[#0B0F19] text-left transition-all cursor-pointer hover:border-slate-600 ${
                        selectedLead?.id === lead.id
                          ? 'border-blue-500 shadow-md ring-1 ring-blue-500/40'
                          : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-medium text-slate-400 truncate">
                          {lead.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-purple-400 tabular-nums">
                          {lead.leadScore ?? 85}pt
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-white line-clamp-1 mb-1">
                        {lead.name}
                      </h5>

                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {lead.city} {lead.neighborhood ? `· ${lead.neighborhood}` : ''}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[10px] text-slate-400">
                        <span className={lead.website ? 'text-blue-400' : 'text-purple-400 font-semibold'}>
                          {lead.website ? 'Com site' : 'Sem site'}
                        </span>
                        {lead.tasks.length > 0 && (
                          <span className="text-slate-400 font-mono">
                            {lead.tasks.filter((t) => t.completed).length}/{lead.tasks.length} tarefas
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="py-10 text-center text-slate-600 text-[11px] italic">
                      Nenhum lead
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-slate-800 bg-[#0B0F19] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-medium">
                <th className="py-3 px-4">Empresa</th>
                <th className="py-3 px-3">Estágio</th>
                <th className="py-3 px-3">Contato &amp; Telefone</th>
                <th className="py-3 px-3">Status Web</th>
                <th className="py-3 px-3 text-right">Score</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`cursor-pointer hover:bg-slate-900/40 transition-colors ${
                    selectedLead?.id === lead.id ? 'bg-blue-600/10' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <p className="font-bold text-white truncate max-w-xs">{lead.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{lead.category} · {lead.city}</p>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={lead.stage || 'new'}
                      onChange={(e) => handleStageChange(lead, e.target.value as PipelineStage)}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1"
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {lead.phone || '—'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={lead.website ? 'text-blue-400' : 'text-purple-400 font-semibold'}>
                      {lead.website ? 'Com website' : 'Sem website'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-purple-400">
                    {lead.leadScore ?? 85}/100
                  </td>
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onOpenAnalysis(lead)}
                        className="px-2 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded"
                      >
                        Claude IA
                      </button>
                      <button
                        onClick={() => onRemoveLead(lead.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Remover do CRM"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Lead Details Drawer / Modal */}
      {selectedLead && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0B0F19] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Detalhes da Oportunidade no CRM
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">{selectedLead.name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {selectedLead.category} &middot; {selectedLead.address}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Stage selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">Estágio:</span>
                <select
                  value={selectedLead.stage || 'new'}
                  onChange={(e) => handleStageChange(selectedLead, e.target.value as PipelineStage)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 font-medium"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => onOpenAnalysis(selectedLead)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ver Dossiê Claude IA</span>
              </button>

              <button
                onClick={() => onOpenWhatsApp(selectedLead)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notes Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Observações &amp; Histórico de Contato
              </h4>

              {/* Add Note Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Adicionar observação sobre a negociação..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddNote}
                  className="px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shrink-0"
                >
                  Salvar
                </button>
              </div>

              {/* Notes List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedLead.notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                    <p className="text-slate-200">{note.text}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {new Date(note.createdAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}
                {selectedLead.notes.length === 0 && (
                  <p className="text-xs text-slate-500 italic">Nenhuma anotação registrada ainda.</p>
                )}
              </div>
            </div>

            {/* Tasks & Reminders */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Tarefas &amp; Próximos Passos
              </h4>

              {/* Add Task Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Ligar para decisor, enviar proposta..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleAddTask}
                  className="px-3 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shrink-0"
                >
                  Criar
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedLead.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                      <span className={task.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Prazo: {task.dueDate}
                    </span>
                  </div>
                ))}
                {selectedLead.tasks.length === 0 && (
                  <p className="text-xs text-slate-500 italic">Nenhum lembrete ou tarefa criada.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
