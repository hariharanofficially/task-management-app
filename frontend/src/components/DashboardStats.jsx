import React from 'react';
import { Layers, CheckCircle2, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export default function DashboardStats({ stats }) {
  const {
    total = 0,
    completed = 0,
    pending = 0,
    highPriority = 0,
    completionRate = 0,
  } = stats || {};

  return (
    <section className="stats-grid" aria-label="Task Analytics and Overview">
      {/* 1. Total Tasks */}
      <div className="stat-card" id="stat-card-total">
        <div className="stat-header">
          <span className="stat-title">Total Tasks</span>
          <div className="stat-icon-wrapper stat-icon-blue">
            <Layers size={18} />
          </div>
        </div>
        <div className="stat-value">{total}</div>
        <div className="stat-meta">
          <TrendingUp size={14} style={{ color: 'var(--primary-light)' }} />
          <span>All tracked work items</span>
        </div>
      </div>

      {/* 2. Completed Tasks */}
      <div className="stat-card" id="stat-card-completed">
        <div className="stat-header">
          <span className="stat-title">Completed</span>
          <div className="stat-icon-wrapper stat-icon-green">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="stat-value">{completed}</div>
        <div className="stat-meta">
          <span>{completionRate}% completion rate</span>
        </div>
        <div className="progress-bar-bg" title={`${completionRate}% complete`}>
          <div
            className="progress-bar-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* 3. Pending Tasks */}
      <div className="stat-card" id="stat-card-pending">
        <div className="stat-header">
          <span className="stat-title">Pending</span>
          <div className="stat-icon-wrapper stat-icon-amber">
            <Clock size={18} />
          </div>
        </div>
        <div className="stat-value">{pending}</div>
        <div className="stat-meta">
          <span>{pending === 1 ? '1 active item' : `${pending} active items requiring action`}</span>
        </div>
      </div>

      {/* 4. High Priority Tasks */}
      <div className="stat-card" id="stat-card-high-priority">
        <div className="stat-header">
          <span className="stat-title">High Priority</span>
          <div className="stat-icon-wrapper stat-icon-red">
            <AlertTriangle size={18} />
          </div>
        </div>
        <div className="stat-value">{highPriority}</div>
        <div className="stat-meta">
          <span>{highPriority > 0 ? 'Urgent attention required' : 'No urgent bottlenecks'}</span>
        </div>
      </div>
    </section>
  );
}
