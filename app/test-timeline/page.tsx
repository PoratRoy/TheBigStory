'use client';

import React from 'react';
import { TimelineView } from '@/app/components/MainView/TimelineView/TimelineView';
import { Category } from '@/models/interface/category';

export default function TestTimelinePage() {
  const mockCategories: Category[] = [
    { id: '1', name: 'ילדות', startYear: 1998, endYear: 2001, color: '#c0634d', timelineId: 't1' },
    { id: '2', name: 'יסודי', startYear: 2001, endYear: 2010, color: '#b7b43f', timelineId: 't1' },
    { id: '3', name: 'כיתה א', startYear: 2001, endYear: 2003, color: '#4db68d', timelineId: 't1' },
    { id: '4', name: 'כיתה ב', startYear: 2003, endYear: 2005, color: '#4d75c0', timelineId: 't1' },
    { id: '5', name: 'חו"ל - רומן...', startYear: 2003, endYear: 2004, color: '#914dc0', timelineId: 't1' },
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, backgroundColor: '#535461', padding: '40px 0' }}>
        <TimelineView categories={mockCategories} />
      </div>
    </div>
  );
}
