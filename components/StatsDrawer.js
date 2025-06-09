import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from './ui/drawer';
import { Button } from './ui/button';

function StatsDrawer({ open, onOpenChange }) {
  const planetStats = [
    { name: 'Mars', count: 6 },
    { name: 'Ceres', count: 3 },
  ];
  const maxCount = Math.max(...planetStats.map(p => p.count));

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">Statistics</DrawerTitle>
        </DrawerHeader>
        <div className="px-6 pb-6 space-y-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold">93</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Games Played</p>
            </div>
            <div>
              <div className="text-3xl font-bold">15%</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Mission Accomplished</p>
            </div>
            <div>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Current Streak</p>
            </div>
            <div>
              <div className="text-3xl font-bold">6</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Max Streak</p>
            </div>
          </div>
          <div>
            <h3 className="text-center text-sm font-semibold mb-2">PLANET DISTRIBUTION</h3>
            <div className="space-y-2">
              {planetStats.map(p => (
                <div key={p.name} className="flex items-center space-x-2">
                  <span className="w-16 text-right text-xs">{p.name}</span>
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded h-3">
                    <div className="bg-emerald-500 h-3 rounded" style={{ width: `${(p.count / maxCount) * 100}%` }} />
                  </div>
                  <span className="w-6 text-xs text-right">{p.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button className="w-full text-base font-semibold bg-black hover:bg-gray-800 text-white">Back to Base</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default StatsDrawer;
