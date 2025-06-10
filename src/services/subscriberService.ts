import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SubscriberFormData } from '@/types/subscriber';

const COLLECTION_NAME = 'subscribers';

export const subscriberService = {
  // Criar novo assinante
  async createSubscriber(data: SubscriberFormData): Promise<string> {
    try {
      console.log('🚀 [SERVICE] Iniciando criação de assinante...');
      console.log('📊 [SERVICE] Dados recebidos:', JSON.stringify(data, null, 2));
      
      // Verificar se o Firebase está inicializado
      console.log('🔥 [SERVICE] Verificando Firebase DB:', db);
      console.log('🔥 [SERVICE] DB app:', db.app);
      console.log('🔥 [SERVICE] DB type:', db.type);
      
      if (!db) {
        console.error('❌ [SERVICE] Firebase database não está inicializada');
        throw new Error('Firebase database não está inicializada');
      }

      // Preparar dados para salvar
      const docData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };

      console.log('📝 [SERVICE] Dados preparados para salvar:', JSON.stringify(docData, null, 2));
      console.log('📁 [SERVICE] Collection name:', COLLECTION_NAME);

      // Tentar criar a referência da coleção
      console.log('🔗 [SERVICE] Criando referência da coleção...');
      const collectionRef = collection(db, COLLECTION_NAME);
      console.log('✅ [SERVICE] Referência da coleção criada:', collectionRef);

      // Tentar adicionar o documento
      console.log('💾 [SERVICE] Tentando adicionar documento ao Firestore...');
      const docRef = await addDoc(collectionRef, docData);
      
      console.log('✅ [SERVICE] Documento adicionado com sucesso!');
      console.log('🆔 [SERVICE] ID do documento:', docRef.id);
      console.log('🔗 [SERVICE] Referência completa do documento:', docRef);
      console.log('📍 [SERVICE] Path do documento:', docRef.path);
      
      // Verificar se o documento foi realmente criado
      console.log('🔍 [SERVICE] Verificando se o documento foi criado...');
      const createdDoc = await getDoc(docRef);
      if (createdDoc.exists()) {
        console.log('✅ [SERVICE] Documento confirmado no Firestore!');
        console.log('📄 [SERVICE] Dados do documento criado:', createdDoc.data());
      } else {
        console.error('❌ [SERVICE] Documento não foi encontrado após criação!');
        throw new Error('Documento não foi criado corretamente');
      }
      
      return docRef.id;
    } catch (error) {
      console.error('❌ [SERVICE] ERRO DETALHADO ao criar assinante:');
      console.error('❌ [SERVICE] Error name:', error?.name);
      console.error('❌ [SERVICE] Error message:', error?.message);
      console.error('❌ [SERVICE] Error code:', error?.code);
      console.error('❌ [SERVICE] Error stack:', error?.stack);
      console.error('❌ [SERVICE] Full error object:', error);
      
      // Re-throw com uma mensagem mais específica
      if (error?.code) {
        throw new Error(`Firebase Error (${error.code}): ${error.message}`);
      } else if (error?.message) {
        throw new Error(`Erro ao salvar: ${error.message}`);
      } else {
        throw new Error('Erro desconhecido ao salvar no Firebase');
      }
    }
  },

  // Buscar todos os assinantes
  async getSubscribers(): Promise<(SubscriberFormData & { id: string })[]> {
    try {
      console.log('🔍 [SERVICE] Buscando assinantes...');
      
      if (!db) {
        throw new Error('Firebase database não está inicializada');
      }

      const collectionRef = collection(db, COLLECTION_NAME);
      console.log('📁 [SERVICE] Referência da coleção para busca:', collectionRef);
      
      const querySnapshot = await getDocs(collectionRef);
      console.log('📊 [SERVICE] QuerySnapshot recebido:', querySnapshot);
      console.log('📊 [SERVICE] Número de documentos:', querySnapshot.size);
      console.log('📊 [SERVICE] QuerySnapshot vazio?', querySnapshot.empty);
      
      const subscribers: (SubscriberFormData & { id: string })[] = [];
      
      querySnapshot.forEach((doc) => {
        console.log('📄 [SERVICE] Documento encontrado - ID:', doc.id);
        console.log('📄 [SERVICE] Documento encontrado - Data:', doc.data());
        subscribers.push({
          id: doc.id,
          ...doc.data() as SubscriberFormData
        });
      });
      
      console.log('✅ [SERVICE] Total de assinantes encontrados:', subscribers.length);
      console.log('✅ [SERVICE] Lista completa:', subscribers);
      return subscribers;
    } catch (error) {
      console.error('❌ [SERVICE] Erro ao buscar assinantes:', error);
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
