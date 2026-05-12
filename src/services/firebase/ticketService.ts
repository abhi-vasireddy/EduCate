import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { Ticket } from '../../types';

export const ticketService = {
  subscribeToTickets(callback: (tickets: Ticket[]) => void) {
    const q = query(collection(db, 'tickets'));
    return onSnapshot(q, (snapshot) => {
      const tickets: Ticket[] = [];
      snapshot.forEach((doc) => {
        tickets.push({ 
          id: doc.id,
          ticketId: doc.id,
          ...doc.data() 
        } as Ticket);
      });
      callback(tickets);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tickets');
    });
  },

  async addTicket(ticket: Partial<Ticket>) {
    try {
      const newRef = doc(collection(db, 'tickets'));
      await setDoc(newRef, {
        ticketId: newRef.id,
        ...ticket,
        createdAt: serverTimestamp(),
      });
      return newRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tickets');
      throw error;
    }
  },

  async updateTicketStatus(id: string, status: string) {
    try {
      const ref = doc(db, 'tickets', id);
      await updateDoc(ref, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tickets/${id}`);
      throw error;
    }
  }
};
