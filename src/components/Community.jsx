import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Feed } from './Feed';
import { FindCompanion } from './FindCompanion';
import { Chats } from './Chats';
import { Experts } from './Experts';

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background border-b border-border z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-semibold">Сообщество</h1>
        </div>
      </div>

      <Tabs defaultValue="feed" className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-4 mx-4 mt-4 mb-2">
          <TabsTrigger value="feed">Лента</TabsTrigger>
          <TabsTrigger value="find">Найти</TabsTrigger>
          <TabsTrigger value="chats">Чаты</TabsTrigger>
          <TabsTrigger value="experts">Эксперты</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="feed" className="h-full m-0">
            <Feed />
          </TabsContent>

          <TabsContent value="find" className="h-full m-0">
            <FindCompanion />
          </TabsContent>

          <TabsContent value="chats" className="h-full m-0">
            <Chats />
          </TabsContent>

          <TabsContent value="experts" className="h-full m-0">
            <Experts />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}