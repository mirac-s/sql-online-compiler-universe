# sql-online-compiler-unverse
(Python & Flask)

Bu proje, Python Flask backend'i ve Ace Editor entegrasyonlu modern bir frontend (HTML, CSS, JavaScript) kullanarak oluşturulmuş, gelişmiş özelliklere sahip basit bir online SQL editörü demo uygulamasıdır. Kullanıcıların SQL sorgularını yazıp çalıştırmasına ve sonuçları görmesine olanak tanır.

**Önemli Güvenlik Uyarısı:** Bu editör, kişisel kullanım veya demo amaçlı tasarlanmıştır. Kullanıcıdan alınan rastgele SQL sorgularını doğrudan çalıştırmak, uygun güvenlik önlemleri (giriş doğrulaması, yetkilendirme, sorgu analizi, izole çalıştırma ortamları gibi) olmadan gerçek uygulamalarda **SON DERECE TEHLİKELİDİR**. Bu örnek, her sunucu yeniden başlatıldığında sıfırlanan bellek içi (in-memory) bir SQLite veritabanı kullanır. **Hassas verilerle kullanmaktan kaçının!**

## Özellikler

* Şık ve modern arayüz (Koyu ve Açık Tema desteği)
* Ace Editor ile gelişmiş kod yazma deneyimi:
    * Sözdizimi vurgulama (SQL)
    * Otomatik tamamlama (SQL anahtar kelimeleri)
    * Parantez ve tırnak otomatik kapatma
    * Satır numaraları
* Ayarlar sayfası (modal):
    * Tema seçimi
    * Yazı Boyutu seçimi
    * Yazı Tipi seçimi
    * Dil seçimi (Türkçe/İngilizce)
* SQL sorgularını çalıştırma ve sonuçları tablo olarak görüntüleme.
* Hata mesajlarını gösterme.
* Editörü temizleme düğmesi.
* Tüm SQL komutlarına izin verir (yalnızca kişisel/demo kullanım için güvenlidir).

## Kurulum ve Çalıştırma

1.  Bu depoyu klonlayın:
    ```bash
    git clone [https://github.com/mirac-s/sql_editor.git](https://github.com/mirac-s/sql_editor.git)
    cd sql-online-compiler-unverse
    ```
    *(Not: Lütfen depoyu kendi GitHub hesabınızda oluşturduktan sonra bu komutu güncelleyin.)*

2.  Bir sanal ortam oluşturun (önerilir):
    ```bash
    python -m venv venv
    ```
    * Windows:
        ```bash
        venv\Scripts\activate
        ```
    * macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

3.  Gerekli kütüphaneleri yükleyin:
    ```bash
    pip install -r requirements.txt
    ```

4.  Flask uygulamasını çalıştırın:
    ```bash
    python app.py
    ```

5.  Tarayıcınızı açın ve `http://localhost:6000` adresine gidin.

## Kullanım

* Editör alanına SQL sorgunuzu yazın.
* "Çalıştır" düğmesine tıklayarak sorguyu çalıştırın.
* Sonuçlar veya hata mesajları alttaki "Sonuçlar" alanında görüntülenecektir.
* "Temizle" düğmesi editördeki içeriği siler.
* "Ayarlar" düğmesine tıklayarak tema, yazı tipi, yazı boyutu ve dil seçeneklerini değiştirebilirsiniz. Ayarlar yerel depolamada (localStorage) saklanır.

## Katkıda Bulunma

Proje geliştirmeye açıktır. Her türlü katkı, hata raporu veya özellik önerisi memnuniyetle karşılanır. Lütfen bir "issue" açın veya "pull request" gönderin.

## Lisans

Bu proje MIT Lisansı altındadır. Daha fazla bilgi için `LICENSE` dosyasına bakın (Eğer bir lisans dosyası ekleyecekseniz).

## Yazar

Miraç S.
GitHub: [@mirac-s](https://github.com/mirac-s)
