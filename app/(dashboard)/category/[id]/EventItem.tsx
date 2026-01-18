'use client';

import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { EventBox } from '@/components/EventBox/EventBox';
import { Event } from '@/models/interface/event';

interface EventItemProps {
  event: Event;
  onDelete: (id: string) => void;
  onToggleCollapse: (id: string, state: boolean) => void;
  onEditFull: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function EventItem({ 
  event, 
  onDelete, 
  onToggleCollapse, 
  onEditFull,
  onEdit
}: EventItemProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item 
      value={event}
      dragListener={false}
      dragControls={dragControls}
      style={{ listStyle: 'none' }}
    >
      <EventBox
        id={event.id}
        text={event.text}
        isCollapse={!!event.isCollapse}
        categories={event.categories || []}
        dragControls={dragControls}
        onDelete={onDelete}
        onToggleCollapse={onToggleCollapse}
        onEditFull={onEditFull}
        onEdit={onEdit}
      />
    </Reorder.Item>
  );
}
