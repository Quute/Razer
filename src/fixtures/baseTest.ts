import {test as base} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

//sayfa nesnelerini içeren bir fixture oluşturuyoruz
type MyFixtures = {
    loginPage: LoginPage;
}

//Playwright'in test fonksiyonunu genişleterek kendi fixture'ımızı ekliyoruz
export const test = base.extend<MyFixtures>({
    //loginPage fixture'ını tanımlıyoruz
    loginPage: async ({ page }, use) => {   
        //Sayfayı oluştur ve kullanıma hazır hale getir
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },});
    
    export { expect } from '@playwright/test';

    