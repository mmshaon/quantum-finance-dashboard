import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, Camera, Trash2, Clock, ShieldCheck, Receipt, X, 
  ChevronUp, ChevronDown, Search, Sparkles, Zap, Scan,
  ArrowRight, RefreshCcw, ArrowUpDown, Upload, File,
  AlertCircle, CheckCircle2, XCircle, TrendingDown, DollarSign,
  LineChart as LineChartIcon, Filter, Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, LineChart, Line
} from 'recharts';
import { currentUser, mockDb } from '../store';
import { ExpenseItem, ExpenseRecord, ExpenseStatus } from '../types';
import { useRipple } from '../App';

type ViewState = 'REGISTRY' | 'ADD' | 'DETAILS';
const CATEGORIES = ['Infrastructure', 'Growth', 'Personnel', 'Neural Tech', 'Operations', 'Misc'];

const StatusIndicator: React.FC<{ status: ExpenseStatus }> = ({ status }) => {
  const config = {
    [ExpenseStatus.PENDING]: { color: '#FFD500', icon: Clock, bg: 'rgba(255,213,0,0.1)' },
    [ExpenseStatus.APPROVED]: { color: '#00FFA3', icon: CheckCircle2, bg: 'rgba(0,255,163,0.1)' },
    [ExpenseStatus.REJECTED]: { color: '#FF6EC7', icon: XCircle, bg: 'rgba(255,110,199,0.1)' }
  };
  const { color, icon: Icon, bg } = config[status] ||