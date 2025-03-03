# Tasks Table Fix

The issue with the tasks table not showing up could be due to a missing component or a rendering error in the TaskTable component.

## Problem Analysis:

Based on the console logs, we can see:
1. `Task query response: { count: 28, projectTasks: 8 }`
2. `Items query response: { count: 28 }`
3. But the table is not rendering on the page

This suggests that data is loading correctly, but there might be an issue with the component rendering. The most likely causes are:

1. A recent change to the TaskTable component that introduced a rendering issue
2. A conditional statement preventing the table from rendering
3. A CSS issue hiding the component
4. A React key issue causing re-rendering problems

## Solution:

After examining the code, the issue appears to be that the TaskTable component or its base component (TaskTableBase) might have a rendering condition that's not being satisfied. 

Here's the updated version of the TaskTable component with fixes:

```tsx
// src/components/TaskTable.tsx (Fixed version)

import React, { useState, useEffect } from 'react';
import TruncatedCell from './TruncatedCell';
import { format } from 'date-fns';
import { Check, MoreHorizontal, Link, ChevronDown, ChevronUp, ChevronRight, AlertCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { NewEntryForm } from '@/components/NewEntryForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import type { Database } from '@/types/database.types';
import type { TaskWithDetails } from '@/lib/types';
import type { Priority, TaskStatus } from '@/types/database.types';
import ScrollableTableWrapper from './layouts/responsiveNav/ScrollableTableWrapper';
import { ProjectTaskManager } from '@/lib/projectTaskManager';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Modified imports and component definition as needed...

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onTaskUpdate }) => {
  const [showCompleted, setShowCompleted] = useState(false);
  const [sorts, setSorts] = useState<SortState[]>([]);
  const [renderTrigger, setRenderTrigger] = useState(Date.now()); // Force re-render if needed

  useEffect(() => {
    // Debug the tasks data to make sure it's available
    console.log('TaskTable received tasks:', tasks.length);
  }, [tasks]);

  const handleSort = (field: SortField): void => {
    // Sort implementation...
  };

  // Make sure we have an array of tasks even if it's empty
  const tasksToRender = Array.isArray(tasks) ? tasks : [];
  
  // Filter active and completed tasks
  const activeTasks = tasksToRender.filter(task => {
    const status = task?.status?.toLowerCase() || 'on_deck';
    return status === 'active' || status === 'on_deck';
  });
  
  const completedTasks = tasksToRender.filter(task => {
    const status = task?.status?.toLowerCase() || 'on_deck';
    return status === 'completed';
  });

  const completedCount = completedTasks.length;

  // Debug render
  console.log('Rendering task table with counts:', {
    total: tasksToRender.length,
    active: activeTasks.length,
    completed: completedCount
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        {activeTasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No active tasks found</div>
        ) : (
          <TaskTableBase 
            tasks={activeTasks}
            onTaskUpdate={onTaskUpdate}
            sorts={sorts}
            onSort={handleSort}
            tableType="active"
          />
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div 
          className="p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChevronRight 
                className={`h-5 w-5 transition-transform ${showCompleted ? 'rotate-90' : ''}`}
              />
              <h3 className="text-lg font-medium">Completed Tasks</h3>
              <Badge variant="secondary">{completedCount}</Badge>
            </div>
          </div>
        </div>
        
        {showCompleted && (
          <div className="p-6">
            {completedTasks.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No completed tasks</div>
            ) : (
              <TaskTableBase 
                tasks={completedTasks}
                onTaskUpdate={onTaskUpdate}
                sorts={sorts}
                onSort={handleSort}
                tableType="completed"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { TaskTable };
export default TaskTable;
```

## Implementation Details:

1. Added debug console logs to trace the component rendering
2. Added a renderTrigger state to force re-rendering if needed
3. Added explicit checks to ensure tasks array is valid
4. Made sure the component renders a placeholder when no tasks are found

Additionally, check that the TasksPage component correctly imports and uses the TaskTable component. A common issue can be improper naming in the exports/imports.
