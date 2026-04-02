import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  DollarSign, 
  PieChart, 
  TrendingUp, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BudgetCategory, BudgetPurchase } from '../types';

interface BudgetOverviewProps {
  userType: 'bride' | 'groom';
}

/**
 * BudgetOverview Component
 * 
 * A comprehensive budget tracking system for wedding planning.
 * Features:
 * - Total budget management
 * - Category-wise planned vs spent tracking
 * - Individual purchase/payment tracking
 * - Visual summaries and alerts
 */
const BudgetOverview: React.FC<BudgetOverviewProps> = ({ userType }) => {
  // --- State Management ---
  
  // Total overall budget set by the user
  const [totalBudget, setTotalBudget] = useState<number>(1500000); // Default 15 Lakhs
  
  // Budget categories (e.g., Venue, Catering)
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: '1', name: 'Venue', planned: 500000 },
    { id: '2', name: 'Catering', planned: 400000 },
    { id: '3', name: 'Photography', planned: 200000 },
    { id: '4', name: 'Decor', planned: 150000 },
    { id: '5', name: 'Bridal Wear', planned: 100000 },
  ]);

  // Individual purchases/payments linked to categories
  const [purchases, setPurchases] = useState<BudgetPurchase[]>([
    { id: 'p1', name: 'Venue Advance', categoryId: '1', cost: 100000, status: 'paid', collaborators: ['bride'] },
    { id: 'p2', name: 'Photographer Deposit', categoryId: '3', cost: 50000, status: 'paid', collaborators: ['groom'] },
    { id: 'p3', name: 'Catering Tasting Fee', categoryId: '2', cost: 5000, status: 'paid', collaborators: ['bride', 'groom'] },
    { id: 'p4', name: 'Decor Sample Payment', categoryId: '4', cost: 10000, status: 'pending', collaborators: ['bride'] },
  ]);

  // UI State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingPurchase, setIsAddingPurchase] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<BudgetPurchase | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // --- Calculations ---

  // Calculate spent amount for each category
  const categoryStats = useMemo(() => {
    return categories.map(cat => {
      const spent = purchases
        .filter(p => p.categoryId === cat.id)
        .reduce((sum, p) => sum + p.cost, 0);
      return {
        ...cat,
        spent,
        remaining: cat.planned - spent,
        isOverBudget: spent > cat.planned
      };
    });
  }, [categories, purchases]);

  // Global Totals
  const totalPlanned = useMemo(() => categories.reduce((sum, cat) => sum + cat.planned, 0), [categories]);
  const totalSpent = useMemo(() => purchases.reduce((sum, p) => sum + p.cost, 0), [purchases]);
  const totalRemaining = totalBudget - totalSpent;
  const budgetUtilization = (totalSpent / totalBudget) * 100;

  // --- Handlers ---

  const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const planned = Number(formData.get('planned'));

    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name, planned } : c));
      setEditingCategory(null);
    } else {
      const newCat: BudgetCategory = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        planned
      };
      setCategories(prev => [...prev, newCat]);
    }
    setIsAddingCategory(false);
  };

  const handleAddPurchase = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const cost = Number(formData.get('cost'));
    const categoryId = formData.get('categoryId') as string;
    const status = formData.get('status') as 'paid' | 'pending';

    if (editingPurchase) {
      setPurchases(prev => prev.map(p => p.id === editingPurchase.id ? { ...p, name, cost, categoryId, status } : p));
      setEditingPurchase(null);
    } else {
      const newPurchase: BudgetPurchase = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        cost,
        categoryId,
        status,
        collaborators: [userType]
      };
      setPurchases(prev => [...prev, newPurchase]);
    }
    setIsAddingPurchase(false);
  };

  const deleteCategory = (id: string) => {
    if (window.confirm('Are you sure? This will also remove all purchases in this category.')) {
      setCategories(prev => prev.filter(c => c.id !== id));
      setPurchases(prev => prev.filter(p => p.categoryId !== id));
    }
  };

  const deletePurchase = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  const togglePurchaseStatus = (id: string) => {
    setPurchases(prev => prev.map(p => 
      p.id === id ? { ...p, status: p.status === 'paid' ? 'pending' : 'paid' } : p
    ));
  };

  // --- Helper Components ---

  const ProgressBar = ({ value, max, color = 'bg-rose' }: { value: number, max: number, color?: string }) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color}`}
        />
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8 bg-ivory min-h-full">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <PieChart className="text-gold" /> Budget Overview
          </h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">
            Tracking for {userType === 'bride' ? 'Bride' : 'Groom'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Total Budget</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-rose">₹{totalBudget.toLocaleString()}</span>
            <button 
              onClick={() => {
                const newBudget = prompt('Enter total budget:', totalBudget.toString());
                if (newBudget) setTotalBudget(Number(newBudget));
              }}
              className="p-1 hover:bg-rose/10 rounded-full text-rose transition-colors"
            >
              <Edit2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Planned</p>
          <p className="text-sm font-bold text-slate-700">₹{totalPlanned.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Spent</p>
          <p className="text-sm font-bold text-rose">₹{totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Remaining</p>
          <p className="text-sm font-bold text-emerald-600">₹{totalRemaining.toLocaleString()}</p>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <TrendingUp size={16} className="text-gold" /> Budget Utilization
          </h3>
          <span className={`text-xs font-bold ${budgetUtilization > 90 ? 'text-red-500' : 'text-slate-500'}`}>
            {budgetUtilization.toFixed(1)}%
          </span>
        </div>
        <ProgressBar value={totalSpent} max={totalBudget} color={budgetUtilization > 90 ? 'bg-red-500' : 'bg-gold'} />
        {budgetUtilization > 100 && (
          <div className="flex items-center gap-2 text-[10px] text-red-500 font-bold bg-red-50 p-2 rounded-xl">
            <AlertCircle size={12} /> You have exceeded your total budget!
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Categories</h3>
          <button 
            onClick={() => {
              setEditingCategory(null);
              setIsAddingCategory(true);
            }}
            className="flex items-center gap-1 text-[10px] font-bold text-rose uppercase tracking-widest hover:bg-rose/5 px-3 py-1 rounded-full transition-colors"
          >
            <Plus size={14} /> Add Category
          </button>
        </div>

        <div className="space-y-3">
          {categoryStats.map((cat) => (
            <div 
              key={cat.id} 
              className={`bg-white rounded-[24px] shadow-sm border transition-all ${expandedCategory === cat.id ? 'border-gold ring-1 ring-gold/20' : 'border-slate-100'}`}
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${cat.isOverBudget ? 'bg-red-50 text-red-500' : 'bg-rose/5 text-rose'}`}>
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{cat.name}</h4>
                    <p className="text-[10px] text-slate-400">
                      ₹{cat.spent.toLocaleString()} of ₹{cat.planned.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Remaining</p>
                    <p className={`text-xs font-bold ${cat.remaining < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                      ₹{cat.remaining.toLocaleString()}
                    </p>
                  </div>
                  {expandedCategory === cat.id ? <ChevronUp size={18} className="text-slate-300" /> : <ChevronDown size={18} className="text-slate-300" />}
                </div>
              </div>

              <AnimatePresence>
                {expandedCategory === cat.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-slate-50 space-y-4">
                      {/* Category Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase">
                          <span className="text-slate-400">Progress</span>
                          <span className={cat.isOverBudget ? 'text-red-500' : 'text-gold'}>
                            {((cat.spent / cat.planned) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <ProgressBar value={cat.spent} max={cat.planned} color={cat.isOverBudget ? 'bg-red-500' : 'bg-gold'} />
                      </div>

                      {/* Purchases List */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Purchases</h5>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (categories.length === 0) {
                                alert('Please add a category first.');
                                return;
                              }
                              setEditingPurchase(null);
                              setIsAddingPurchase(true);
                            }}
                            className="text-[10px] font-bold text-rose"
                          >
                            + Add Item
                          </button>
                        </div>
                        <div className="space-y-2">
                          {purchases.filter(p => p.categoryId === cat.id).map(p => (
                            <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => togglePurchaseStatus(p.id)}
                                  className={`transition-colors ${p.status === 'paid' ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-400'}`}
                                >
                                  <CheckCircle2 size={18} />
                                </button>
                                <div>
                                  <p className="text-xs font-bold text-slate-700">{p.name}</p>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${p.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                      {p.status}
                                    </span>
                                    <div className="flex -space-x-1">
                                      {p.collaborators.map(c => (
                                        <div key={c} className={`w-3 h-3 rounded-full border border-white text-[6px] flex items-center justify-center font-bold text-white ${c === 'bride' ? 'bg-rose' : 'bg-blue-400'}`}>
                                          {c[0].toUpperCase()}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-600">₹{p.cost.toLocaleString()}</span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => { setEditingPurchase(p); setIsAddingPurchase(true); }} className="p-1 text-slate-400 hover:text-gold"><Edit2 size={12} /></button>
                                  <button onClick={() => deletePurchase(p.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                                </div>
                              </div>
                            </div>
                          ))}
                          {purchases.filter(p => p.categoryId === cat.id).length === 0 && (
                            <p className="text-[10px] text-slate-400 text-center py-2 italic">No purchases yet.</p>
                          )}
                        </div>
                      </div>

                      {/* Category Actions */}
                      <div className="flex justify-end gap-2 pt-2">
                        <button 
                          onClick={() => { setEditingCategory(cat); setIsAddingCategory(true); }}
                          className="p-2 text-slate-400 hover:text-gold transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => deleteCategory(cat.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-slate-200">
              <DollarSign className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-500 font-medium mb-4">No budget categories yet.</p>
              <button 
                onClick={() => setIsAddingCategory(true)}
                className="bg-rose text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose/20"
              >
                Create First Category
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      <AnimatePresence>
        {isAddingCategory && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <form onSubmit={handleAddCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Name</label>
                  <input 
                    name="name"
                    defaultValue={editingCategory?.name}
                    required
                    placeholder="e.g. Venue, Catering..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-gold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Planned Budget (₹)</label>
                  <input 
                    name="planned"
                    type="number"
                    defaultValue={editingCategory?.planned}
                    required
                    placeholder="500000"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-gold transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="flex-1 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-2xl font-bold bg-rose text-white shadow-lg shadow-rose/20 active:scale-95 transition-transform"
                  >
                    {editingCategory ? 'Update' : 'Add Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Purchase Modal */}
      <AnimatePresence>
        {isAddingPurchase && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                {editingPurchase ? 'Edit Purchase' : 'Add Purchase'}
              </h3>
              <form onSubmit={handleAddPurchase} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item Name</label>
                  <input 
                    name="name"
                    defaultValue={editingPurchase?.name}
                    required
                    placeholder="e.g. Advance Payment"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-gold transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cost (₹)</label>
                    <input 
                      name="cost"
                      type="number"
                      defaultValue={editingPurchase?.cost}
                      required
                      placeholder="10000"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-gold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                    <select 
                      name="status"
                      defaultValue={editingPurchase?.status || 'pending'}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-gold transition-all text-xs font-bold"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                  <select 
                    name="categoryId"
                    defaultValue={editingPurchase?.categoryId || expandedCategory || ''}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-gold transition-all text-xs font-bold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsAddingPurchase(false)}
                    className="flex-1 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-2xl font-bold bg-rose text-white shadow-lg shadow-rose/20 active:scale-95 transition-transform"
                  >
                    {editingPurchase ? 'Update' : 'Add Purchase'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BudgetOverview;
