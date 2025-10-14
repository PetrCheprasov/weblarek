import { IBuyer } from "../../../types"; 

export class Buyer { 
  protected buyer: IBuyer = { 
    'payment': '', 
    'address': '', 
    'phone': '', 
    'email': '' 
  }; 

  constructor() { 
  } 

  // Валидация отдельных полей
  protected validateField(field: keyof IBuyer, value: string): boolean {
    switch (field) {
      case 'email':
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
        return emailRegex.test(value);
      
      case 'phone':
        const phoneRegex = /^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/;
        return phoneRegex.test(value);
      
      case 'payment':
        return value === 'card' || value === 'cash';
      
      case 'address':
        return value.trim().length > 0;
      
      default:
        return false;
    }
  }

  // Универсальный метод для обновления любого поля
  public updateField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): boolean {
    if (this.validateField(field, value as string)) {
      this.buyer[field] = value;
      console.log(`Поле ${field} успешно обновлено`);
      return true;
    } else {
      console.log(`Некорректное значение для поля ${field}`);
      return false;
    }
  }

  // Альтернативный вариант: отдельные методы для каждого поля
  public setEmail(email: string): boolean {
    return this.updateField('email', email);
  }

  public setPhone(phone: string): boolean {
    return this.updateField('phone', phone);
  }

  public setAddress(address: string): boolean {
    return this.updateField('address', address);
  }

  public setPayment(payment: 'card' | 'cash'): boolean {
    return this.updateField('payment', payment);
  }

  // Полная проверка всех данных (для финальной валидации перед отправкой)
  public isValid(): boolean {
    return (
      !!this.buyer.payment && 
      !!this.buyer.address && 
      this.validateField('email', this.buyer.email) && 
      this.validateField('phone', this.buyer.phone)
    );
  }

  public getData(): IBuyer { 
    return { ...this.buyer }; // возвращаем копию для иммутабельности
  } 

  public clearData(): void { 
    this.buyer.payment = ''; 
    this.buyer.address = ''; 
    this.buyer.email = ''; 
    this.buyer.phone = ''; 
  } 

  // Старый метод оставлен для обратной совместимости, но можно deprecated
  public setData(newBuyer: IBuyer): void { 
    // Постепенное обновление с валидацией каждого поля
    let allValid = true;
    
    if (newBuyer.payment) {
      if (!this.updateField('payment', newBuyer.payment)) allValid = false;
    }
    
    if (newBuyer.address) {
      if (!this.updateField('address', newBuyer.address)) allValid = false;
    }
    
    if (newBuyer.email) {
      if (!this.updateField('email', newBuyer.email)) allValid = false;
    }
    
    if (newBuyer.phone) {
      if (!this.updateField('phone', newBuyer.phone)) allValid = false;
    }

    if (allValid) {
      console.log('Все данные покупателя успешно обновлены и валидны');
    } else {
      console.log('Часть данных покупателя некорректна');
    }
  } 
}