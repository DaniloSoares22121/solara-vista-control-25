
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SubscriberFormData } from '@/types/subscriber';

const COLLECTION_NAME = 'subscribers';

export const subscriberService = {
  // Criar novo assinante
  async createSubscriber(data: SubscriberFormData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      });
      console.log('Assinante criado com ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar assinante:', error);
      throw error;
    }
  },

  // Buscar todos os assinantes
  async getSubscribers(): Promise<(SubscriberFormData & { id: string })[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const subscribers: (SubscriberFormData & { id: string })[] = [];
      
      querySnapshot.forEach((doc) => {
        subscribers.push({
          id: doc.id,
          ...doc.data() as SubscriberFormData
        });
      });
      
      console.log('Assinantes encontrados:', subscribers.length);
      return subscribers;
    } catch (error) {
      console.error('Erro ao buscar assinantes:', error);
      throw error;
    }
  },

  // Buscar assinante por ID
  async getSubscriberById(id: string): Promise<(SubscriberFormData & { id: string }) | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data() as SubscriberFormData
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar assinante:', error);
      throw error;
    }
  },

  // Atualizar assinante
  async updateSubscriber(id: string, data: Partial<SubscriberFormData>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      console.log('Assinante atualizado:', id);
    } catch (error) {
      console.error('Erro ao atualizar assinante:', error);
      throw error;
    }
  },

  // Deletar assinante
  async deleteSubscriber(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      console.log('Assinante deletado:', id);
    } catch (error) {
      console.error('Erro ao deletar assinante:', error);
      throw error;
    }
  }
};
