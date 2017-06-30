<?php

echo '
<div class="layout-50 page-4">

    <div class="layout-50-left">

        <h3>On The Map</h3>
        <div id="map"></div>

        <h3 class="margin-top-30">Anand Pilania</h3>
        <p>
            RZ-80<br/>
            Gopal Nagar, Najafgarh, New Delhi, India
        </p>

        <ul class="no-list contact-list">
            <li class="contact-list-phone"><span>Phone:</span> +91-9414411995</li>
            <li class="contact-list-fax"><span>Fax:</span> *.***.***.***</li>
            <li class="contact-list-mail"><span>Mail:</span> anandpilania@gmail.com</li>
        </ul>

    </div>

    <div class="layout-50-right">

        <h3>Get In Touch</h3>

        <form name="contact-form" id="contact-form" action="" method="post">

            <div>

                <div class="form-line block">
					<label for="contact-form-name" class="infield">Your name *</label>
                    <input type="text" name="contact-form-name" id="contact-form-name" value=""/>	
                </div>
                <div class="form-line block">
					<label for="contact-form-mail" class="infield">Your e-mail *</label>
                    <input type="text" name="contact-form-mail" id="contact-form-mail" value=""/>	
                </div>					
                <div class="form-line block">
					<label for="contact-form-message" class="infield">Your message *</label>
                    <textarea rows="0" cols="0" name="contact-form-message" id="contact-form-message" ></textarea>	
                </div>

                <div class="form-line">
					<div class="block float-right">
						<input type="submit" class="button" id="contact-form-send" value="Send"/>
					</div>
					<div class="float-right margin-right-10">
						<input type="reset" class="button" id="contact-form-reset" value="Reset"/>
					</div>
                </div>

            </div>	

        </form>

    </div>

</div>
';