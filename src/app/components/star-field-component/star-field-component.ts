import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-star-field-component',
  imports: [],
  templateUrl: './star-field-component.html',
  standalone: true,
  styleUrl: './star-field-component.scss'
})
export class StarFieldComponent implements AfterViewInit {

  //ToDO moze jeszcze kiedy tutaj pokombinuje z gwiazdkami do login screena poki co lepiej wyglada bez

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.5
    }));

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 12;
        ctx.fill();
      }
    }


    function animate() {
      const time = Date.now();

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Pozycja X jako procent szerokości ekranu
        const xRatio = star.x / canvas.width;

        // Symulacja gradientu: najciemniej w środku (0.5), najjaśniej na bokach (0 i 1)
        const visibilityFactor = Math.abs(xRatio - 0.5) * 2; // od 0 do 1

        // Dodaj subtelne migotanie
        const flicker = 0.3 + Math.sin(time * 0.002 + i) * 0.2;

        // Finalna jasność
        star.opacity = visibilityFactor * flicker;
      }

      drawStars();
      requestAnimationFrame(animate);
    }





    animate();
  }

}
