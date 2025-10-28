# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения
Приложение построено по принципу MVP (Model-View-Presenter), что обеспечивает разделение логики между компонентами данных, отображения и управления. Каждый уровень выполняет строго определенные функции:

Model - управляет хранением и модификацией данных

View - отвечает за визуализацию информации в пользовательском интерфейсе

Presenter - координирует взаимодействие между представлением и данными, содержа основную бизнес-логику

Связь между компонентами организована через событийную модель. Изменения в данных или пользовательские действия генерируют события, которые обрабатываются Презентером с использованием методов Моделей и Представлений.

### Основные компоненты
##### Базовый класс Component
Универсальный базовый класс для создания элементов интерфейса. Использует generic тип T для данных, передаваемых в метод render.

### Конструктор:

constructor(container: HTMLElement) - принимает ссылку на DOM-элемент для отображения

Свойства:

container: HTMLElement - корневой DOM-элемент компонента

### Методы:

render(data?: Partial<T>): HTMLElement - основной метод отрисовки, принимает данные для отображения и возвращает DOM-элемент

setImage(element: HTMLImageElement, src: string, alt?: string): void - вспомогательный метод для работы с изображениями

#### Класс Api
Инкапсулирует логику HTTP-запросов.

### Конструктор:

constructor(baseUrl: string, options: RequestInit = {}) - принимает базовый URL и опциональные параметры запросов

### Свойства:

baseUrl: string - основной адрес сервера

options: RequestInit - настройки заголовков запросов

### Методы:

get(uri: string): Promise<object> - выполняет GET-запрос

post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> - отправляет данные на сервер

handleResponse(response: Response): Promise<object> - проверяет корректность ответа сервера

#### Класс EventEmitter
Реализует паттерн "Наблюдатель" для организации событийной коммуникации между слоями приложения.

### Свойства:

_events: Map<string | RegExp, Set<Function>>) - коллекция подписок на события

### Методы:

on<T extends object>(event: EventName, callback: (data: T) => void): void - регистрация обработчика события

emit<T extends object>(event: string, data?: T): void - генерация события

trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void - создание функции-триггера события

## Типы данных
### IProduct
Описание структуры товара:

id: string - уникальный идентификатор

title: string - наименование товара

image: string - URL изображения

category: enum string - категория товара

price: number | null - цена (может отсутствовать)

description: string - детальное описание

### IBuyer
Данные покупателя:

payment: 'cash' | 'card' | '' - способ оплаты

address: string - адрес доставки

email: string - электронная почта

phone: string - номер телефона

### IProductCart
Расширяет IProduct для корзины:

inCart: boolean - признак наличия в корзине

### Дополнительные интерфейсы
ISuccessOrder - данные успешного заказа

IErrors - описание ошибок валидации

IgetProducts - структура ответа сервера с товарами

IpostProducts - данные для отправки заказа

IElementsList - список DOM-элементов

IHeaderData - данные для шапки приложения

IModalData - параметры модального окна

ISuccesOrderData - информация об успешном заказе

### Модели данных
#### Catalog
Управление каталогом товаров.

### Методы:

getProducts(): IProduct[] - получение всех товаров

setProducts(products: IProduct[]): void - обновление списка товаров

getProductByID(id: string): IProduct | null - поиск товара по ID

getPickedProduct(): IProduct | null - получение выбранного товара

setPickedProduct(id: string): void - выбор товара для детального просмотра

#### Cart
Управление корзиной покупок.

### Методы:

addProduct(product: IProduct):void - добавление товара

deleteProduct(product: IProduct):void - удаление товара

clearCart():void - очистка корзины

getQuantityCartItems():number - подсчет количества товаров

getCartItems(): IProduct[] - получение содержимого корзины

getTotalPrice(): number - расчет общей стоимости

cartHasProduct(product: IProduct): boolean - проверка наличия товара

#### Buyer
Управление данными покупателя и валидация.

### Методы:

getData(): IBuyer - получение данных покупателя

setPayment(value: 'cash' | 'card' | ''): void - установка способа оплаты

setAddress(value: string): void - установка адреса

setEmail(value: string): void - установка email

setPhone(value: string): void - установка телефона

clearData(): void - очистка данных

## Слой коммуникации
### ComApi
Адаптер для работы с API.

### Методы:

protected checkData(data: any): data is IgetProducts - валидация данных от сервера

public async get(uri: string = '/product/'): Promise<IProduct[]> - загрузка товаров

public async post(uri: string = '/order/', data: IpostProducts | {} = {}) - отправка заказа

## Компоненты представления
Иерархия карточек товаров
Card - базовый класс карточки

CardCart - карточка товара в корзине

CardCatalog - карточка товара в каталоге

CardModal - детальная карточка товара

## Специализированные компоненты
CartView - представление корзины товаров

Form, FormContacts, FormOrder - формы ввода данных

Gallery - галерея товаров

Header - шапка приложения

Modal - модальное окно

SuccessOrder - сообщение об успешном заказе

## Система событий
События данных
products:changed - изменение каталога товаров

product:setted - выбор товара для просмотра

cart:changed - изменение содержимого корзины

## События интерфейса
product:selected - выбор товара в каталоге

product:actionWithCart - действие с товаром в корзине

product:deleteToCart - удаление из корзины

form:order - начало оформления заказа

modal:closed - закрытие модального окна

cart:opened - открытие корзины

## События форм
payMethod:chosen, address:added - ввод данных заказа

email:added, phone:added - ввод контактных данных

order:checkData, contacts:checkData - валидация данных

order:submit, contacts:submit - отправка форм

## Логика презентера
Презентер координирует работу всех компонентов приложения:

Инициализация - загрузка товаров с сервера через ComApi

Обработка событий каталога - отображение товаров, детальной информации

Управление корзиной - добавление/удаление товаров, пересчет стоимости

Работа с модальными окнами - открытие/закрытие, управление контентом

Обработка форм - валидация, сбор данных, отправка заказа

Очистка данных - сброс состояния после успешного заказа

Все взаимодействия между компонентами осуществляются через событийную шину, что обеспечивает слабую связность и легкость тестирования отдельных модулей приложения.