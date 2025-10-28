import './types/index.ts'; 
import './scss/styles.scss'; 
import { Api } from "./components/base/Api"; 
import { ComApi } from "./components/base/comApi/comApi.ts"; 
import { Buyer } from "./components/Models/Buyer.ts"; 
import { Cart } from "./components/Models/Cart.ts"; 
import { Catalog } from "./components/Models/Catalog"; 
import { API_URL, eventsList } from "./utils/constants"; 
import { IBuyer} from './types/index.ts';
import { EventEmitter } from './components/base/Events.ts';
import { Header } from './components/views/header.ts';
import { cloneTemplate } from './utils/utils.ts';
import { Gallery } from './components/views/gallery.ts';
import { Modal } from './components/views/modal.ts';
import { CardCatalog } from './components/views/CardCatalog.ts';
import { CardModal } from './components/views/CardModal.ts';
import { CardCart } from './components/views/CardCart.ts';
import { CartView } from './components/views/CardView.ts';
import { FormOrder } from './components/views/formorder.ts';
import { FormContacts } from './components/views/formcontacts.ts';
import { SuccessOrder } from './components/views/successorder.ts';

const events = new EventEmitter();
const comApi = new ComApi(new Api(API_URL));
const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();

const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const fullCardTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const compactCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successOrderTemplate = document.querySelector('#success') as HTMLTemplateElement;

const header = new Header(document.querySelector('.header') as HTMLElement, events);
const page = new Gallery(document.querySelector('.page__wrapper') as HTMLElement, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);
const cardModal = new CardModal(cloneTemplate(fullCardTemplate), events);
const cartView = new CartView(cloneTemplate(cartTemplate), events);
const order = new FormOrder(cloneTemplate(orderTemplate), events);
const contacts = new FormContacts(cloneTemplate(contactsTemplate), events);
const successOrder = new SuccessOrder(cloneTemplate(successOrderTemplate), events);

comApi.get()
  .then(res => {
    res.forEach(item => {
      if (item.image) {
        item.image = item.image.replace(/^['"]|['"]$/g, '').replace(/\.jpg$/, '.png');
      }
    });
    catalog.setProducts(res);
  }).catch(err => console.error(err));

events.on(eventsList['products:changed'], () => {
  const productsHTMLArray = catalog.getProducts().map(item => {
    return new CardCatalog(cloneTemplate(cardTemplate), events).render(item);
  });
  page.render({
    elementsList: productsHTMLArray
  });
});

events.on(eventsList['product:selected'], ({ id }: { id: string }) => {
  const product = catalog.getProductByID(id);
  if (product) {
    catalog.setPickedProduct(product);
  }
});

events.on(eventsList['product:setted'], () => {
  const pickedProduct = catalog.getPickedProduct();
  if (!pickedProduct) return;
  
  const inCart = cart.cartHasProduct(pickedProduct);

  modal.render({
    content: cardModal.render({ ...pickedProduct, inCart }),
    isOpen: true,
    modalContent: 'product'
  });
});

events.on(eventsList['modal:noScroll'], () => {
  document.body.style.overflow = 'hidden';
});

events.on(eventsList['modal:closed'], () => {
  document.body.style.overflow = 'auto';
  catalog.setPickedProduct(null);
  modal.render({
    content: null,
    isOpen: false,
    modalContent: ''
  });
});

events.on(eventsList['cart:opened'], () => {
  if (cart.getQuantityCartItems() === 0) {
    modal.render({
      content: cartView.render({
        elementsList: [cartView.getPlacer()]
      }),
      isOpen: true,
      modalContent: 'cart'
    });
    cartView.setDisableCartButtonOrder(true);
  } else {
    const cartProductsHTMLArray = cart.getCartItems().map((item, ind) => {
      return new CardCart(cloneTemplate(compactCardTemplate), events, ind + 1).render(item);
    });
    modal.render({
      content: cartView.render({
        elementsList: cartProductsHTMLArray
      }),
      isOpen: true,
      modalContent: 'cart'
    });
    cartView.setDisableCartButtonOrder(false);
  }
  cartView.setTotalPrice(cart.getTotalPrice());
});

events.on(eventsList['product:actionWithCart'], ({ id }: { id: string }) => {
  const product = catalog.getProductByID(id);
  if (!product) return;
  
  if (cart.cartHasProduct(product)) {
    cart.deleteProduct(product);
  } else {
    cart.addProduct(product);
  }
});

events.on(eventsList['product:deleteToCart'], ({ id }: { id: string }) => {
  const product = catalog.getProductByID(id);
  if (!product) return;
  cart.deleteProduct(product);
});

events.on(eventsList['cart:changed'], () => {
  if (cart.getQuantityCartItems() === 0) {
    cartView.render({
      elementsList: [cartView.getPlacer()]
    });
    cartView.setDisableCartButtonOrder(true);
  } else {
    const cartProductsHTMLArray = cart.getCartItems().map((item, ind) => {
      return new CardCart(cloneTemplate(compactCardTemplate), events, ind + 1).render(item);
    });
    cartView.render({
      elementsList: cartProductsHTMLArray
    });
    cartView.setDisableCartButtonOrder(false);
  }
  cartView.setTotalPrice(cart.getTotalPrice());

  if (modal.getModalComponent() === 'product') {
    const pickedProduct = catalog.getPickedProduct();
    if (pickedProduct) {
      const inCart = cart.cartHasProduct(pickedProduct);
      modal.render({
        content: cardModal.render({ ...pickedProduct, inCart }),
        isOpen: true,
        modalContent: 'product'
      });
    }
  }

  header.render({
    counter: cart.getQuantityCartItems()
  });
});

events.on(eventsList['form:order'], () => {
  modal.render({
    content: order.render(),
    isOpen: true,
    modalContent: 'order'
  });
});

events.on(eventsList['payMethod:chosen'], ({ name }: { name: 'cash' | 'card' | '' }) => {
  if (name === 'cash' || name === 'card') {
    buyer.setPayment(name);
  }
});
events.on(eventsList['payMethod:added'], ({ name }: { name: 'cash' | 'card' | '' }) => {
  order.setActivePayMethod(name);
});

events.on(eventsList['address:added'], ({ value }: { value: string }) => {
  buyer.setAddress(value);
});

events.on(eventsList['order:checkData'], () => {
  order.clearError();
  if (!buyer.getData('payment')) {
    order.setErrorMessage('Необходимо выбрать способ оплаты');
    order.disableFormButton(false);
  } else if (!buyer.getData('address')) {
    order.setErrorMessage('Необходимо указать адрес');
    order.disableFormButton(false);
  } else {
    order.disableFormButton(true);
  }
});

events.on(eventsList['order:submit'], () => {
  modal.render({
    content: contacts.render(),
    isOpen: true,
    modalContent: 'contacts'
  });
});

events.on(eventsList['email:added'], ({ value }: { value: string }) => {
  buyer.setEmail(value);
});

events.on(eventsList['phone:added'], ({ value }: { value: string }) => {
  buyer.setPhone(value);
});

events.on(eventsList['contacts:checkData'], () => {
  contacts.setError('');

  if (!buyer.getData('email')) {
    contacts.setError('Необходимо указать email');
    contacts.disableFormButton(false);
  } else if (!buyer.getData('phone')) {
    contacts.setError('Необходимо указать телефон');
    contacts.disableFormButton(false);
  } else {
    contacts.disableFormButton(true);
  }
});

events.on(eventsList['contacts:submit'], () => {
  comApi.post('/order/', {
    ...buyer.getData() as IBuyer,
    total: cart.getTotalPrice(),
    items: cart.getCartItems().map(item => item.id)
  }).then(resp => {
    if ('total' in resp) {
      modal.render({
        content: successOrder.render({ totalSum: resp.total }),
        isOpen: true,
        modalContent: 'success'
      });
      cart.clearCart();
      buyer.clearData();
    } else {
      contacts.setError(resp.err || 'Ошибка при оформлении заказа');
    }
  }).catch(err => {
    console.log(err);
    contacts.setError('Ошибка при оформлении заказа');
  });
});